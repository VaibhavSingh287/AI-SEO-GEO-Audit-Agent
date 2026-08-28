import { NormalizedPageData, TechnicalCheck, TechnicalSeoResult, AuditSourceMode, AuditDataProvider, TechnicalScoreBreakdown } from '../types';

export class TechnicalSeoAnalyzer {
  public static analyze(
    data: NormalizedPageData,
    sourceMode: AuditSourceMode = 'LIVE_URL',
    dataProvider: AuditDataProvider = 'LIVE_HTML'
  ): TechnicalSeoResult {
    const checks: TechnicalCheck[] = [];

    // Helper to push check with provenance
    const addCheck = (check: Omit<TechnicalCheck, 'sourceMode' | 'dataProvider'>) => {
      checks.push({
        ...check,
        sourceMode,
        dataProvider
      });
    };

    // 1. Title Check (10 pts)
    const titleLen = data.title.length;
    if (titleLen === 0) {
      addCheck({
        id: 'tech-title-missing',
        name: 'Page Title Tag',
        category: 'On-Page',
        status: 'ISSUE',
        scoreWeight: 10,
        scoreAwarded: 0,
        finding: 'No <title> tag detected in HTML document.',
        evidence: `Extracted title: "" (0 characters).`,
        recommendedFix: 'Add a descriptive <title> tag between 30 and 65 characters incorporating primary entity and topic.'
      });
    } else if (titleLen < 25) {
      addCheck({
        id: 'tech-title-short',
        name: 'Page Title Tag',
        category: 'On-Page',
        status: 'WARNING',
        scoreWeight: 10,
        scoreAwarded: 6,
        finding: `Title is short (${titleLen} characters). Search engines may rewrite it or under-represent page scope.`,
        evidence: `Extracted title: "${data.title}" (${titleLen} chars). Recommended range: 30–65 chars.`,
        recommendedFix: 'Expand title to include secondary branding or key value proposition.'
      });
    } else if (titleLen > 70) {
      addCheck({
        id: 'tech-title-long',
        name: 'Page Title Tag',
        category: 'On-Page',
        status: 'WARNING',
        scoreWeight: 10,
        scoreAwarded: 7,
        finding: `Title is long (${titleLen} characters) and may be truncated on search engine result pages.`,
        evidence: `Extracted title: "${data.title}" (${titleLen} chars). SERP pixel truncation usually occurs at >60–65 chars.`,
        recommendedFix: 'Shorten title to under 65 characters, prioritizing primary entity first.'
      });
    } else {
      addCheck({
        id: 'tech-title-pass',
        name: 'Page Title Tag',
        category: 'On-Page',
        status: 'PASS',
        scoreWeight: 10,
        scoreAwarded: 10,
        finding: `Title length is optimal (${titleLen} characters).`,
        evidence: `Extracted title: "${data.title}" (${titleLen} chars).`
      });
    }

    // 2. Meta Description Check (10 pts)
    const descLen = data.metaDescription.length;
    if (descLen === 0) {
      addCheck({
        id: 'tech-meta-desc-missing',
        name: 'Meta Description',
        category: 'On-Page',
        status: 'ISSUE',
        scoreWeight: 10,
        scoreAwarded: 0,
        finding: 'No meta description tag detected.',
        evidence: 'Meta description content is empty.',
        recommendedFix: 'Provide a concise meta description between 120 and 160 characters summarizing the page.'
      });
    } else if (descLen < 80) {
      addCheck({
        id: 'tech-meta-desc-short',
        name: 'Meta Description',
        category: 'On-Page',
        status: 'WARNING',
        scoreWeight: 10,
        scoreAwarded: 6,
        finding: `Meta description is short (${descLen} characters).`,
        evidence: `Extracted meta description: "${data.metaDescription}" (${descLen} chars).`,
        recommendedFix: 'Elaborate on page benefits and target topic to reach 120–160 characters.'
      });
    } else if (descLen > 175) {
      addCheck({
        id: 'tech-meta-desc-long',
        name: 'Meta Description',
        category: 'On-Page',
        status: 'WARNING',
        scoreWeight: 10,
        scoreAwarded: 7,
        finding: `Meta description is slightly long (${descLen} characters) and may be truncated on mobile/desktop snippets.`,
        evidence: `Extracted length: ${descLen} chars. Optimal: 120–160 chars.`,
        recommendedFix: 'Tighten description copy to ensure complete visibility in search snippets.'
      });
    } else {
      addCheck({
        id: 'tech-meta-desc-pass',
        name: 'Meta Description',
        category: 'On-Page',
        status: 'PASS',
        scoreWeight: 10,
        scoreAwarded: 10,
        finding: `Meta description is within ideal range (${descLen} characters).`,
        evidence: `Extracted meta description: "${data.metaDescription}" (${descLen} chars).`
      });
    }

    // 3. H1 Heading Check (10 pts)
    const h1Count = data.headings.h1.length;
    if (h1Count === 0) {
      addCheck({
        id: 'tech-h1-missing',
        name: 'H1 Primary Heading',
        category: 'Structure',
        status: 'ISSUE',
        scoreWeight: 10,
        scoreAwarded: 0,
        finding: 'No H1 heading found on page.',
        evidence: 'H1 tags detected: 0.',
        recommendedFix: 'Add exactly one clear, topic-defining <h1> element to establish document hierarchy.'
      });
    } else if (h1Count > 1) {
      addCheck({
        id: 'tech-h1-multiple',
        name: 'H1 Primary Heading',
        category: 'Structure',
        status: 'WARNING',
        scoreWeight: 10,
        scoreAwarded: 6,
        finding: `Multiple H1 headings detected (${h1Count}). While not an explicit error, single H1 is best practice for entity clarity.`,
        evidence: `Detected H1s: ${data.headings.h1.map(h => `"${h}"`).join(', ')}.`,
        recommendedFix: 'Retain one primary <h1> for main page topic and convert secondary headings to <h2>.'
      });
    } else {
      addCheck({
        id: 'tech-h1-pass',
        name: 'H1 Primary Heading',
        category: 'Structure',
        status: 'PASS',
        scoreWeight: 10,
        scoreAwarded: 10,
        finding: 'Single primary H1 heading detected.',
        evidence: `H1: "${data.headings.h1[0]}"`
      });
    }

    // 4. Heading Hierarchy & Distribution (10 pts)
    const h2Count = data.headings.h2.length;
    const h3Count = data.headings.h3.length;
    if (h2Count === 0 && data.wordCount > 150) {
      addCheck({
        id: 'tech-heading-flat',
        name: 'Heading Structure & Hierarchy',
        category: 'Structure',
        status: 'ISSUE',
        scoreWeight: 10,
        scoreAwarded: 3,
        finding: 'Flat heading hierarchy without H2 section headings.',
        evidence: `H1: ${h1Count}, H2: ${h2Count}, H3: ${h3Count} for ${data.wordCount} words.`,
        recommendedFix: 'Subdivide document into logical thematic sections with <h2> and <h3> tags.'
      });
    } else if (h2Count < 2 && data.wordCount > 400) {
      addCheck({
        id: 'tech-heading-weak',
        name: 'Heading Structure & Hierarchy',
        category: 'Structure',
        status: 'WARNING',
        scoreWeight: 10,
        scoreAwarded: 6,
        finding: `Sparse heading distribution (${h2Count} H2s) for long-form content.`,
        evidence: `H2 tags: ${h2Count}, H3 tags: ${h3Count}, Total words: ${data.wordCount}.`,
        recommendedFix: 'Break long text sections into scannable subtopics.'
      });
    } else {
      addCheck({
        id: 'tech-heading-pass',
        name: 'Heading Structure & Hierarchy',
        category: 'Structure',
        status: 'PASS',
        scoreWeight: 10,
        scoreAwarded: 10,
        finding: 'Document exhibits clear heading hierarchy.',
        evidence: `Structure breakdown: ${h1Count} H1, ${h2Count} H2s, ${h3Count} H3s across ${data.wordCount} words.`
      });
    }

    // 5. Canonical Tag (10 pts)
    if (!data.canonical) {
      addCheck({
        id: 'tech-canonical-missing',
        name: 'Canonical Tag Specification',
        category: 'Indexability',
        status: 'WARNING',
        scoreWeight: 10,
        scoreAwarded: 4,
        finding: 'No canonical URL link tag detected.',
        evidence: '<link rel="canonical"> is not declared in <head>.',
        recommendedFix: 'Add self-referencing or authoritative <link rel="canonical" href="..."> to prevent duplicate URL parameters.'
      });
    } else {
      addCheck({
        id: 'tech-canonical-pass',
        name: 'Canonical Tag Specification',
        category: 'Indexability',
        status: 'PASS',
        scoreWeight: 10,
        scoreAwarded: 10,
        finding: 'Canonical URL directive detected.',
        evidence: `Declared canonical: "${data.canonical}".`
      });
    }

    // 6. Robots Meta Directive (10 pts)
    if (data.robots && (data.robots.toLowerCase().includes('noindex') || data.robots.toLowerCase().includes('none'))) {
      addCheck({
        id: 'tech-robots-noindex',
        name: 'Robots Indexability Directive',
        category: 'Indexability',
        status: 'ISSUE',
        scoreWeight: 10,
        scoreAwarded: 0,
        finding: 'Blocking "noindex" directive found in robots meta tag.',
        evidence: `Robots directive: "${data.robots}".`,
        recommendedFix: 'Remove "noindex" directive from production pages intended for public indexing.'
      });
    } else if (data.robots) {
      addCheck({
        id: 'tech-robots-pass',
        name: 'Robots Indexability Directive',
        category: 'Indexability',
        status: 'PASS',
        scoreWeight: 10,
        scoreAwarded: 10,
        finding: 'Robots meta contains no blocking directives.',
        evidence: `Robots directive: "${data.robots}".`
      });
    } else {
      addCheck({
        id: 'tech-robots-default-pass',
        name: 'Robots Indexability Directive',
        category: 'Indexability',
        status: 'PASS',
        scoreWeight: 10,
        scoreAwarded: 10,
        finding: 'Standard default indexing assumed (no restrictive robots meta tag present).',
        evidence: 'No restrictive robots meta tag detected.'
      });
    }

    // 7. Image Optimization & Alt Attributes (10 pts)
    const totalImg = data.images.total;
    const missingAlt = data.images.missingAlt;
    if (totalImg === 0) {
      addCheck({
        id: 'tech-images-none',
        name: 'Image Alt Attributes',
        category: 'Images',
        status: 'PASS',
        scoreWeight: 10,
        scoreAwarded: 10,
        finding: 'No image elements detected on page.',
        evidence: '0 images present.'
      });
    } else if (missingAlt > 0) {
      const altRatio = (totalImg - missingAlt) / totalImg;
      const score = Math.round(altRatio * 10);
      addCheck({
        id: 'tech-images-missing-alt',
        name: 'Image Alt Attributes',
        category: 'Images',
        status: missingAlt > 2 ? 'ISSUE' : 'WARNING',
        scoreWeight: 10,
        scoreAwarded: score,
        finding: `${missingAlt} of ${totalImg} images are missing descriptive alt attributes.`,
        evidence: `Missing alt count: ${missingAlt} / ${totalImg} (${Math.round((missingAlt/totalImg)*100)}% unannotated).`,
        recommendedFix: 'Add descriptive alt text conveying context and entity details for all informative images.'
      });
    } else {
      addCheck({
        id: 'tech-images-pass',
        name: 'Image Alt Attributes',
        category: 'Images',
        status: 'PASS',
        scoreWeight: 10,
        scoreAwarded: 10,
        finding: 'All detected images include descriptive alt attributes.',
        evidence: `${totalImg} / ${totalImg} images properly have alt tags.`
      });
    }

    // 8. Internal & Navigation Linking (10 pts)
    const internalLinks = data.links.internal;
    if (internalLinks === 0) {
      addCheck({
        id: 'tech-links-orphan',
        name: 'Internal Linking Signals',
        category: 'Links',
        status: 'ISSUE',
        scoreWeight: 10,
        scoreAwarded: 2,
        finding: 'No internal links detected. Page may act as an orphan endpoint with weak link juice distribution.',
        evidence: `Internal links count: 0 (External: ${data.links.external}).`,
        recommendedFix: 'Incorporate contextual internal links to related topic clusters and navigational anchors.'
      });
    } else if (internalLinks < 4) {
      addCheck({
        id: 'tech-links-low',
        name: 'Internal Linking Signals',
        category: 'Links',
        status: 'WARNING',
        scoreWeight: 10,
        scoreAwarded: 6,
        finding: `Low internal link density (${internalLinks} links).`,
        evidence: `Internal links: ${internalLinks}, External links: ${data.links.external}.`,
        recommendedFix: 'Add 3–5 contextual in-content links to authoritative related hub pages.'
      });
    } else {
      addCheck({
        id: 'tech-links-pass',
        name: 'Internal Linking Signals',
        category: 'Links',
        status: 'PASS',
        scoreWeight: 10,
        scoreAwarded: 10,
        finding: `Healthy internal linking distribution (${internalLinks} links detected).`,
        evidence: `Internal links: ${internalLinks}, External links: ${data.links.external}.`
      });
    }

    // 9. Structured Data / JSON-LD Schema (10 pts)
    const schemaTypes = data.structuredData.types;
    if (schemaTypes.length === 0) {
      addCheck({
        id: 'tech-schema-missing',
        name: 'Structured Data / JSON-LD',
        category: 'Structured Data',
        status: 'ISSUE',
        scoreWeight: 10,
        scoreAwarded: 0,
        finding: 'No JSON-LD structured data detected on page.',
        evidence: 'Detected schema types: None. JSON-LD scripts: 0.',
        recommendedFix: 'Embed JSON-LD schemas such as WebPage, Organization, Product, Article, or FAQPage to enhance entity resolution.'
      });
    } else {
      addCheck({
        id: 'tech-schema-pass',
        name: 'Structured Data / JSON-LD',
        category: 'Structured Data',
        status: 'PASS',
        scoreWeight: 10,
        scoreAwarded: 10,
        finding: `Detected ${schemaTypes.length} structured data type(s): ${schemaTypes.join(', ')}.`,
        evidence: `Detected JSON-LD types: ${schemaTypes.join(', ')}. Raw schemas: ${data.structuredData.raw.length}.`
      });
    }

    // 10. Open Graph & Social Discovery (10 pts)
    const ogCount = Object.keys(data.openGraph).length;
    if (ogCount === 0) {
      addCheck({
        id: 'tech-og-missing',
        name: 'Open Graph & Social Discovery',
        category: 'Social',
        status: 'WARNING',
        scoreWeight: 10,
        scoreAwarded: 3,
        finding: 'No Open Graph metadata tags detected.',
        evidence: 'og:title, og:description, and og:image are not defined.',
        recommendedFix: 'Add Open Graph meta tags (og:title, og:description, og:image, og:type) for rich social snippet cards.'
      });
    } else if (!data.openGraph.title || !data.openGraph.description) {
      addCheck({
        id: 'tech-og-partial',
        name: 'Open Graph & Social Discovery',
        category: 'Social',
        status: 'WARNING',
        scoreWeight: 10,
        scoreAwarded: 7,
        finding: 'Incomplete Open Graph tags (missing title or description).',
        evidence: `Detected OG keys: ${Object.keys(data.openGraph).join(', ')}.`,
        recommendedFix: 'Ensure og:title, og:description, and og:image are consistently present.'
      });
    } else {
      addCheck({
        id: 'tech-og-pass',
        name: 'Open Graph & Social Discovery',
        category: 'Social',
        status: 'PASS',
        scoreWeight: 10,
        scoreAwarded: 10,
        finding: 'Complete Open Graph metadata tags detected.',
        evidence: `Configured OG tags: ${Object.keys(data.openGraph).join(', ')}.`
      });
    }

    // Calculate individual score breakdown
    const scoreBreakdown: TechnicalScoreBreakdown = {
      title: checks.find(c => c.name === 'Page Title Tag')?.scoreAwarded || 0,
      metaDescription: checks.find(c => c.name === 'Meta Description')?.scoreAwarded || 0,
      h1: checks.find(c => c.name === 'H1 Primary Heading')?.scoreAwarded || 0,
      headingStructure: checks.find(c => c.name === 'Heading Structure & Hierarchy')?.scoreAwarded || 0,
      canonical: checks.find(c => c.name === 'Canonical Tag Specification')?.scoreAwarded || 0,
      robots: checks.find(c => c.name === 'Robots Indexability Directive')?.scoreAwarded || 0,
      internalLinks: checks.find(c => c.name === 'Internal Linking Signals')?.scoreAwarded || 0,
      imagesAlt: checks.find(c => c.name === 'Image Alt Attributes')?.scoreAwarded || 0,
      structuredData: checks.find(c => c.name === 'Structured Data / JSON-LD')?.scoreAwarded || 0,
      openGraph: checks.find(c => c.name === 'Open Graph & Social Discovery')?.scoreAwarded || 0,
      total: 0
    };

    const totalScore = checks.reduce((sum, c) => sum + c.scoreAwarded, 0);
    scoreBreakdown.total = Math.min(100, Math.max(0, totalScore));

    const passedCount = checks.filter(c => c.status === 'PASS').length;
    const warningCount = checks.filter(c => c.status === 'WARNING').length;
    const issueCount = checks.filter(c => c.status === 'ISSUE').length;

    let summary = `Technical analysis verified ${checks.length} deterministic on-page signals. `;
    if (issueCount === 0 && warningCount === 0) {
      summary += 'All fundamental crawlability, metadata, and structural checks passed cleanly.';
    } else {
      summary += `Found ${issueCount} critical issue(s) and ${warningCount} warning(s) requiring remediation.`;
    }

    // Development diagnostic log
    if (typeof window !== 'undefined' || process.env.NODE_ENV !== 'production') {
      console.log(`[TechnicalSeoAnalyzer] Executed for ${data.url} (${sourceMode}):`, {
        score: scoreBreakdown.total,
        scoreBreakdown,
        title: data.title,
        canonical: data.canonical,
        h1List: data.headings.h1,
        h2Count: data.headings.h2.length,
        wordCount: data.wordCount,
        imagesTotal: data.images.total,
        missingAlt: data.images.missingAlt,
        schemaTypes: data.structuredData.types
      });
    }

    return {
      score: scoreBreakdown.total,
      scoreBreakdown,
      checks,
      passedCount,
      warningCount,
      issueCount,
      summary
    };
  }
}

