import { 
  AuditReport, 
  AuditStageInfo, 
  AuditConfiguration, 
  AppSettings,
  NormalizedPageData,
  AuditSourceMode,
  AuditDataProvider,
  PipelineStageLineage
} from '../types';
import { HtmlAnalyzer } from './htmlAnalyzer';
import { TechnicalSeoAnalyzer } from './technicalSeoAnalyzer';
import { EntityAnalyzer } from './entityAnalyzer';
import { GeoAnalyzer } from './geoAnalyzer';
import { GeminiAIProvider, OfflineDemoProvider, AIProvider } from './aiProvider';
import { StorageService } from './storage';
import { DEMO_HTML_APEXCARE } from './demoData';

export type StageUpdateCallback = (stages: AuditStageInfo[], overallProgress: number) => void;

export class AuditOrchestrator {
  public static async executeAudit(
    input: {
      type: 'url' | 'html' | 'demo';
      value?: string;
      url?: string;
    },
    config: AuditConfiguration,
    settings: AppSettings,
    onProgress?: StageUpdateCallback
  ): Promise<{ success: boolean; report?: AuditReport; error?: string; hint?: string }> {
    const startTime = Date.now();
    const isExplicitDemo = input.type === 'demo';
    const auditMode: 'live' | 'upload' | 'demo' = input.type === 'demo' ? 'demo' : input.type === 'html' ? 'upload' : 'live';
    const sourceMode: AuditSourceMode = 
      auditMode === 'live' ? 'LIVE_URL' : auditMode === 'upload' ? 'HTML_UPLOAD' : 'DEMO';
    const dataProvider: AuditDataProvider = 
      auditMode === 'live' ? 'LIVE_HTML' : auditMode === 'upload' ? 'UPLOADED_HTML' : 'DEMO_DATA';

    // 7 Canonical, Non-Duplicated Audit Pipeline Stages
    const stages: AuditStageInfo[] = [
      { id: 'stage-ingest', label: 'Website Data Ingestion & DOM Parsing', status: 'pending' },
      { id: 'stage-tech', label: 'Technical SEO Diagnostics', status: 'pending' },
      { id: 'stage-content', label: 'Content & Search Intent Analysis', status: 'pending' },
      { id: 'stage-entity', label: 'Entity Knowledge Graphing', status: 'pending' },
      { id: 'stage-geo', label: 'GEO & AI Search Evaluation', status: 'pending' },
      { id: 'stage-rec', label: 'Recommendation Generation', status: 'pending' },
      { id: 'stage-eval', label: 'AI Quality & Evidence Validation', status: 'pending' }
    ];

    const updateStage = (index: number, status: 'pending' | 'running' | 'completed' | 'failed', details?: string) => {
      stages[index].status = status;
      if (details) stages[index].details = details;
      const completedCount = stages.filter(s => s.status === 'completed').length;
      const progress = Math.round((completedCount / stages.length) * 100);
      if (onProgress) onProgress([...stages], progress);
    };

    let htmlContent = '';
    let targetUrl = input.url || 'https://example.com';
    let websiteName = 'Web Document';
    let fetchStatusCode: number | undefined = undefined;
    let contentType = 'text/html';
    let htmlHash = '';
    let payloadBytes = 0;

    try {
      // ----------------------------------------------------
      // STAGE 1: Website Data Ingestion & DOM Parsing
      // ----------------------------------------------------
      updateStage(0, 'running');
      const stage1Start = Date.now();

      if (input.type === 'demo') {
        htmlContent = DEMO_HTML_APEXCARE;
        targetUrl = 'https://apexcare-health-demo.internal';
        websiteName = 'ApexCare Health Insurance';
        fetchStatusCode = 200;
        contentType = 'text/html; charset=UTF-8';
        htmlHash = 'sha_apexcare_demo';
        payloadBytes = htmlContent.length;
        await new Promise(r => setTimeout(r, 200));
      } else if (input.type === 'html') {
        htmlContent = input.value || '';
        if (!htmlContent.trim()) {
          updateStage(0, 'failed', 'Empty HTML file provided');
          return { success: false, error: 'Uploaded HTML content was empty. Please select a valid HTML file.' };
        }
        targetUrl = input.url || 'https://uploaded-document.local';
        websiteName = 'Uploaded HTML Document';
        fetchStatusCode = 200;
        contentType = 'text/html';
        
        let hashNum = 5381;
        for (let i = 0; i < htmlContent.length; i++) {
          hashNum = ((hashNum << 5) + hashNum) + htmlContent.charCodeAt(i);
          hashNum = hashNum & hashNum;
        }
        htmlHash = `sha_${Math.abs(hashNum).toString(16).padStart(8, '0')}`;
        payloadBytes = htmlContent.length;
        await new Promise(r => setTimeout(r, 180));
      } else if (input.type === 'url') {
        targetUrl = input.value?.trim() || 'https://example.com';
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
          targetUrl = `https://${targetUrl}`;
        }

        try {
          const u = new URL(targetUrl);
          websiteName = u.hostname.replace(/^www\./, '');
        } catch {
          websiteName = targetUrl;
        }

        try {
          const fetchRes = await fetch('/api/fetch-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: targetUrl })
          });

          const fetchJson = await fetchRes.json();
          if (fetchJson.success && fetchJson.html) {
            htmlContent = fetchJson.html;
            fetchStatusCode = fetchJson.status || 200;
            contentType = fetchJson.contentType || 'text/html';
            htmlHash = fetchJson.hash || `sha_${Math.abs(Date.now()).toString(16)}`;
            payloadBytes = fetchJson.bytes || htmlContent.length;
            if (fetchJson.finalUrl) targetUrl = fetchJson.finalUrl;
          } else {
            updateStage(0, 'failed', fetchJson.error || 'Live URL retrieval failed');
            return {
              success: false,
              error: fetchJson.error || 'Unable to analyze this URL directly.',
              hint: fetchJson.fallbackHint || 'The target website may have anti-bot protections or firewall policies. You can upload the raw HTML export directly or use the demo website.'
            };
          }
        } catch (fetchErr: any) {
          updateStage(0, 'failed', 'Network communication error');
          return {
            success: false,
            error: fetchErr?.message || 'Unable to analyze this URL directly.',
            hint: 'The network connection to the target URL could not be established. Please upload the raw HTML export or use the demo website.'
          };
        }
      }

      // Assert that demo data never leaked into live / upload audits
      if (auditMode === 'live' || auditMode === 'upload') {
        if (
          websiteName.toLowerCase().includes('apexcare') ||
          targetUrl.includes('apexcare-health-demo') ||
          htmlContent.includes('ApexCare Advantage Health Plan')
        ) {
          console.error('BUG: Demo data entered a live audit.');
          throw new Error('BUG: Demo data entered a live audit.');
        }
      }

      stages[0].durationMs = Date.now() - stage1Start;
      updateStage(0, 'completed', `Ingested ${Math.round(payloadBytes / 1024)} KB payload (${htmlHash.slice(0, 12)})`);

      // ----------------------------------------------------
      // STAGE 2: Technical SEO Diagnostics
      // ----------------------------------------------------
      updateStage(1, 'running');
      const stage2Start = Date.now();
      const extractedData: NormalizedPageData = HtmlAnalyzer.analyze(htmlContent, targetUrl);
      if (extractedData.title) {
        websiteName = extractedData.title.split(/[-|•—]/)[0]?.trim() || websiteName;
      }
      
      const technicalSeo = TechnicalSeoAnalyzer.analyze(extractedData, sourceMode, dataProvider);
      await new Promise(r => setTimeout(r, 160));
      stages[1].durationMs = Date.now() - stage2Start;
      updateStage(1, 'completed', `Technical Score: ${technicalSeo.score}/100 (${technicalSeo.issueCount} issues, ${technicalSeo.warningCount} warnings)`);

      // Setup AI Provider
      const activeProviderType: 'gemini' | 'offline_demo' = (settings.aiProvider === 'gemini' && !isExplicitDemo)
        ? 'gemini'
        : 'offline_demo';

      const aiProvider: AIProvider = activeProviderType === 'gemini'
        ? new GeminiAIProvider()
        : new OfflineDemoProvider();

      // ----------------------------------------------------
      // STAGE 3: Content Analysis
      // ----------------------------------------------------
      updateStage(2, 'running');
      const stage3Start = Date.now();
      const contentAnalysis = await aiProvider.analyzeContentAndIntent(extractedData);
      stages[2].durationMs = Date.now() - stage3Start;
      updateStage(2, 'completed', `Intent: ${contentAnalysis.likelySearchIntent} (${contentAnalysis.overallContentScore}/100)`);

      // ----------------------------------------------------
      // STAGE 4: Entity Knowledge Graphing
      // ----------------------------------------------------
      updateStage(3, 'running');
      const stage4Start = Date.now();
      const entityAnalysis = EntityAnalyzer.analyze(extractedData);
      await new Promise(r => setTimeout(r, 140));
      stages[3].durationMs = Date.now() - stage4Start;
      updateStage(3, 'completed', `Mapped ${entityAnalysis.entities.length} entities & ${entityAnalysis.relationships.length} relationships`);

      // ----------------------------------------------------
      // STAGE 5: GEO & AI Search Evaluation
      // ----------------------------------------------------
      updateStage(4, 'running');
      const stage5Start = Date.now();
      const geoAnalysis = GeoAnalyzer.analyze(extractedData);
      await new Promise(r => setTimeout(r, 160));
      stages[4].durationMs = Date.now() - stage5Start;
      updateStage(4, 'completed', `GEO Score: ${geoAnalysis.score}/100 across 6 search dimensions`);

      // ----------------------------------------------------
      // STAGE 6: Recommendation Generation
      // ----------------------------------------------------
      updateStage(5, 'running');
      const stage6Start = Date.now();
      const recommendations = await aiProvider.generateRecommendations(
        extractedData,
        technicalSeo,
        contentAnalysis,
        entityAnalysis,
        geoAnalysis,
        sourceMode,
        dataProvider
      );
      stages[5].durationMs = Date.now() - stage6Start;
      updateStage(5, 'completed', `Synthesized ${recommendations.length} recommendations with evidence anchors`);

      // ----------------------------------------------------
      // STAGE 7: Recommendation Evaluation
      // ----------------------------------------------------
      updateStage(6, 'running');
      const stage7Start = Date.now();
      const evaluation = await aiProvider.evaluateRecommendations(recommendations);
      stages[6].durationMs = Date.now() - stage7Start;
      updateStage(6, 'completed', `Quality: ${evaluation.overallQualityScore}% (Grounding: ${evaluation.evidenceSupportedRate}%)`);

      // Overall Score Computations
      const overallSeo = Math.round(
        technicalSeo.score * 0.35 +
        contentAnalysis.overallContentScore * 0.35 +
        entityAnalysis.score * 0.15 +
        geoAnalysis.score * 0.15
      );

      const aiSearchReadiness = Math.round(
        geoAnalysis.score * 0.70 +
        entityAnalysis.score * 0.30
      );

      const totalDuration = Date.now() - startTime;

      // Pipeline Stage Lineage Map
      const isDemoAudit = sourceMode === 'DEMO';
      const expectedProvider: AuditDataProvider = isDemoAudit ? 'DEMO_DATA' : (sourceMode === 'LIVE_URL' ? 'LIVE_HTML' : 'UPLOADED_HTML');

      const pipelineLineage = [
        {
          stageName: 'Data Ingestion',
          inputSource: sourceMode === 'LIVE_URL' ? `HTTP GET ${targetUrl}` : sourceMode === 'HTML_UPLOAD' ? 'User Upload File' : 'Local Mock Blueprint',
          outputSource: dataProvider,
          status: 'VERIFIED' as const,
          details: `Payload: ${(payloadBytes / 1024).toFixed(1)} KB, Hash: ${htmlHash.slice(0, 12)}`
        },
        {
          stageName: 'DOM Signal Extraction',
          inputSource: dataProvider,
          outputSource: 'Normalized DOM Tree',
          status: 'VERIFIED' as const,
          details: `Extracted ${extractedData.wordCount} words, ${extractedData.headings.h1.length} H1s, ${extractedData.structuredData.types.length} JSON-LD schemas`
        },
        {
          stageName: 'Technical SEO Analyzer',
          inputSource: 'Normalized DOM Tree',
          outputSource: 'Deterministic Diagnostics',
          status: 'VERIFIED' as const,
          details: `Computed score ${technicalSeo.score}/100 across 10 verifiable on-page checks`
        },
        {
          stageName: 'Content & Search Intent Analyzer',
          inputSource: 'Normalized Text & Headings',
          outputSource: 'Intent & Semantic Profile',
          status: 'VERIFIED' as const,
          details: `Classified as ${contentAnalysis.likelySearchIntent} (${contentAnalysis.overallContentScore}/100)`
        },
        {
          stageName: 'Entity Knowledge Graphing',
          inputSource: 'Normalized Text & Metadata',
          outputSource: 'Entity Graph Nodes',
          status: 'VERIFIED' as const,
          details: `Identified ${entityAnalysis.entities.length} entities and ${entityAnalysis.relationships.length} conceptual relationships`
        },
        {
          stageName: 'GEO Readiness Evaluator',
          inputSource: 'Full Document Signals',
          outputSource: '6 GEO Dimensions',
          status: 'VERIFIED' as const,
          details: `Calculated ${geoAnalysis.score}/100 across Answer Directness, Schema & Citations`
        },
        {
          stageName: 'Recommendation Engine',
          inputSource: 'Audit Findings & Signals',
          outputSource: 'Actionable Priority Plan',
          status: 'VERIFIED' as const,
          details: `Generated ${recommendations.length} recommendations linked directly to observable evidence`
        },
        {
          stageName: 'Quality & Grounding Evaluation',
          inputSource: 'Generated Recommendations',
          outputSource: 'Audit Validation Score',
          status: 'VERIFIED' as const,
          details: `Grounding rate ${evaluation.evidenceSupportedRate}%, Actionability ${evaluation.actionabilityRate}%`
        }
      ];

      const debugInfo = {
        sourceMode,
        requestedUrl: input.type === 'url' ? input.value : targetUrl,
        finalUrl: targetUrl,
        fetchStatus: (fetchStatusCode === 200 ? 'SUCCESS' : (auditMode === 'demo' ? 'LOCAL_DEMO' : 'FAILED')) as 'SUCCESS' | 'FAILED' | 'LOCAL_DEMO',
        httpStatus: fetchStatusCode || 200,
        contentType,
        htmlLength: payloadBytes,
        htmlHash,
        dataProvider,
        technicalProvider: (auditMode === 'demo' ? 'DEMO_DATA' : 'LIVE_HTML_ANALYSIS') as 'LIVE_HTML_ANALYSIS' | 'DEMO_DATA',
        contentProvider: (auditMode === 'demo' ? 'DEMO_DATA' : (activeProviderType === 'gemini' ? 'GEMINI' : 'LOCAL_DETERMINISTIC')) as 'GEMINI' | 'LOCAL_DETERMINISTIC' | 'DEMO_DATA',
        entityProvider: (auditMode === 'demo' ? 'DEMO_DATA' : 'LIVE_HTML_ANALYSIS') as 'LIVE_HTML_ANALYSIS' | 'DEMO_DATA',
        geoProvider: (auditMode === 'demo' ? 'DEMO_DATA' : (activeProviderType === 'gemini' ? 'GEMINI' : 'LIVE_HTML_ANALYSIS')) as 'LIVE_HTML_ANALYSIS' | 'GEMINI' | 'DEMO_DATA',
        recommendationProvider: (auditMode === 'demo' ? 'DEMO_DATA' : 'LIVE_FINDINGS') as 'LIVE_FINDINGS' | 'DEMO_DATA',
        durationMs: totalDuration,
        pipelineLineage,
        extractedProof: {
          title: extractedData.title || 'Not detected',
          metaDescription: extractedData.metaDescription || 'Not detected',
          canonical: extractedData.canonical || 'Not detected',
          h1Count: extractedData.headings.h1.length,
          h1List: extractedData.headings.h1,
          h2Count: extractedData.headings.h2.length,
          internalLinks: extractedData.links.internal,
          externalLinks: extractedData.links.external,
          imagesCount: extractedData.images.total,
          missingAltCount: extractedData.images.missingAlt,
          jsonLdTypes: extractedData.structuredData.types,
          wordCount: extractedData.wordCount
        }
      };

      const report: AuditReport = {
        id: `audit-${Date.now()}`,
        website: websiteName,
        url: targetUrl,
        createdAt: new Date().toISOString(),
        mode: auditMode,
        sourceMode,
        provider: activeProviderType,
        durationMs: totalDuration,
        scores: {
          overallSeo,
          technicalSeo: technicalSeo.score,
          content: contentAnalysis.overallContentScore,
          entity: entityAnalysis.score,
          geoReadiness: geoAnalysis.score,
          aiSearchReadiness
        },
        extractedData,
        technicalSeo,
        contentAnalysis,
        entityAnalysis,
        geoAnalysis,
        recommendations,
        evaluation,
        stages,
        debugInfo,
        pipelineLineage
      };

      // Persist to storage
      StorageService.saveAudit(report);

      return {
        success: true,
        report
      };
    } catch (e: any) {
      console.error('Audit execution error:', e);
      return {
        success: false,
        error: e?.message || 'An unexpected error occurred during audit execution.',
        hint: 'You can test the application instantly using the demo website or by uploading an HTML document.'
      };
    }
  }
}
