import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/api/gemini/status", (req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
    res.json({
      configured: hasKey,
      model: "gemini-3.6-flash",
      provider: hasKey ? "gemini" : "offline_demo"
    });
  });

  // URL Fetch Proxy Route with graceful error fallback
  app.post("/api/fetch-url", async (req, res) => {
    const { url } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Valid URL is required" });
    }

    let targetUrl = url.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = `https://${targetUrl}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(targetUrl, {
        signal: controller.signal,
        redirect: "follow",
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Sec-Ch-Ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": "\"macOS\"",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "Upgrade-Insecure-Requests": "1"
        }
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get("content-type") || "text/html";
      const wafAction = response.headers.get("x-amzn-waf-action");

      // Check for non-200 status or WAF challenges (e.g. HTTP 202 with AWS WAF challenge)
      if (response.status !== 200 || wafAction === "challenge") {
        return res.status(200).json({
          success: false,
          status: response.status,
          contentType,
          error: `HTTP ${response.status}: Target website returned an automated bot challenge / anti-scraping protection (${wafAction || response.statusText || 'Access Interstitial'}).`,
          fallbackHint: "This website blocks direct server-to-server crawling. You can upload the raw HTML document directly in 'HTML Upload' mode or test with a public endpoint like wikipedia.org, ibm.com, or use the demo website."
        });
      }

      const html = await response.text();

      // Detect JavaScript challenge interstitials in HTML
      const isChallengeHtml = (
        html.includes("awsWafCookieDomainList") ||
        html.includes("gokuProps") ||
        html.includes("cf-browser-verification") ||
        html.includes("Checking your browser") ||
        (html.includes("<h1>JavaScript is disabled</h1>") && html.length < 5000)
      );

      if (isChallengeHtml) {
        return res.status(200).json({
          success: false,
          status: 202,
          contentType,
          error: "HTTP 202: Target server returned an anti-bot JavaScript challenge interstitial rather than the webpage content.",
          fallbackHint: "The website requires interactive browser execution. Please use 'HTML Upload' to audit the saved page source directly or test with a standard public website."
        });
      }
      
      // Calculate simple deterministic fingerprint (DJB2 / Hex hash)
      let hashNum = 5381;
      for (let i = 0; i < html.length; i++) {
        hashNum = ((hashNum << 5) + hashNum) + html.charCodeAt(i);
        hashNum = hashNum & hashNum; // Convert to 32bit integer
      }
      const hashStr = Math.abs(hashNum).toString(16).padStart(8, '0');
      const finalUrl = response.url || targetUrl;

      return res.json({
        success: true,
        status: response.status,
        contentType,
        html: html.slice(0, 2000000), // Cap at 2MB
        bytes: html.length,
        hash: `sha_${hashStr}`,
        finalUrl
      });
    } catch (err: any) {
      return res.status(200).json({
        success: false,
        error: err?.message || "Unable to analyze this URL directly.",
        fallbackHint: "Browser security, network timeout, or website restrictions may prevent direct analysis. Please upload HTML or use the demo website."
      });
    }
  });

  // AI Structured Analysis Route
  app.post("/api/gemini/analyze", async (req, res) => {
    const { task, payload } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        success: false,
        useFallback: true,
        message: "Gemini API key is not configured. Falling back to deterministic local engine."
      });
    }

    try {
      let prompt = "";
      if (task === "content_and_entities") {
        prompt = `You are an expert SEO & Generative Engine Optimization (GEO) technical analyst. Analyze the following webpage content:
Title: ${payload.title}
Meta Description: ${payload.metaDescription}
Headings H1: ${JSON.stringify(payload.headings?.h1 || [])}
Headings H2: ${JSON.stringify(payload.headings?.h2 || [])}
Body text sample: ${payload.visibleText?.slice(0, 3000)}

Return strict JSON matching this structure:
{
  "primaryTopic": string,
  "likelySearchIntent": "Informational" | "Navigational" | "Commercial Investigation" | "Transactional" | "Local",
  "intentConfidence": number (0 to 1),
  "intentReason": string (reference actual words from text),
  "topicCoverageScore": number (0 to 100),
  "questionCoverageScore": number (0 to 100),
  "structureScore": number (0 to 100),
  "contentGaps": string[],
  "detectedQuestions": string[],
  "searchIntentAlignment": string,
  "recommendedImprovements": string[]
}

Ensure all score numbers are integers between 0 and 100.`;
      } else {
        prompt = `Analyze this SEO & GEO audit dataset and provide refined observations in JSON:
${JSON.stringify(payload).slice(0, 3000)}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an analytical B2B SEO & GEO evaluation system. Always return strictly valid JSON.",
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });

      const responseText = response.text || "{}";
      let parsedJson: any = {};
      try {
        parsedJson = JSON.parse(responseText.trim().replace(/^```json\s*/, '').replace(/```$/, ''));
      } catch {
        return res.status(200).json({ success: false, useFallback: true, error: "Malformed AI response JSON" });
      }

      return res.json({
        success: true,
        data: parsedJson
      });
    } catch (error: any) {
      console.warn("Gemini execution failed, falling back to deterministic local analyzer:", error?.message);
      return res.status(200).json({
        success: false,
        useFallback: true,
        error: error?.message || "Gemini service temporarily unavailable"
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: "0.0.0.0", port: 3000 },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI SEO & GEO Audit Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
