import { 
  NormalizedPageData, 
  TechnicalSeoResult, 
  ContentAnalysisResult, 
  EntityAnalysisResult, 
  GeoAnalysisResult, 
  Recommendation,
  AuditSourceMode,
  AuditDataProvider
} from '../types';

export class RecommendationEngine {
  public static generate(
    data: NormalizedPageData,
    tech: TechnicalSeoResult,
    content: ContentAnalysisResult,
    entity: EntityAnalysisResult,
    geo: GeoAnalysisResult,
    sourceMode: AuditSourceMode = 'LIVE_URL',
    dataProvider: AuditDataProvider = 'LIVE_HTML'
  ): Recommendation[] {
    const rawRecs: Recommendation[] = [];

    // Helper to push recommendation with provenance
    const addRec = (rec: Omit<Recommendation, 'sourceMode' | 'dataProvider' | 'sourceFindingIds'>) => {
      rawRecs.push({
        ...rec,
        sourceMode,
        dataProvider,
        sourceFindingIds: rec.evidenceIds || []
      });
    };

    // 1. Technical SEO Recommendations from Issues/Warnings
    const canonicalCheck = tech.checks.find(c => c.id.startsWith('tech-canonical') && c.status !== 'PASS');
    if (canonicalCheck) {
      addRec({
        id: 'rec-tech-1',
        title: 'Specify Canonical URL Directive',
        description: 'Declare a self-referencing canonical URL in the HTML head to prevent duplicate URL tracking and consolidate link equity across query parameters.',
        area: 'Technical',
        priority: 'P1',
        impact: 'High',
        effort: 'Low',
        confidence: 0.94,
        evidenceIds: [canonicalCheck.id],
        evidenceDetails: [canonicalCheck.evidence, canonicalCheck.finding],
        recommendedAction: 'Insert <link rel="canonical" href="https://example.com/page-path" /> within the document <head>.',
        codeSnippet: `<link rel="canonical" href="${data.url.startsWith('http') ? data.url : `https://${data.url}`}" />`
      });
    }

    const schemaCheck = tech.checks.find(c => c.id.startsWith('tech-schema') && c.status !== 'PASS');
    const hasOrgSchema = data.structuredData.types.includes('Organization');
    if (schemaCheck || !hasOrgSchema) {
      addRec({
        id: 'rec-tech-2',
        title: 'Deploy Organization & WebPage JSON-LD Schema',
        description: 'Incorporate Schema.org structured data to explicitly define organization identity, official name, brand logo, and social profile links for machine entity resolution.',
        area: 'Technical',
        priority: 'P0',
        impact: 'High',
        effort: 'Medium',
        confidence: 0.96,
        evidenceIds: [schemaCheck ? schemaCheck.id : 'tech-schema-pass'],
        evidenceDetails: [
          `Current schema types: [${data.structuredData.types.join(', ') || 'None'}].`,
          'Organization schema not detected in JSON-LD scripts.'
        ],
        recommendedAction: 'Add a JSON-LD script block defining Organization and WebPage entities at the root layout level.',
        codeSnippet: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "${data.url}#organization",
      "name": "${entity.entities[0]?.entity || 'Company Name'}",
      "url": "${data.url}",
      "logo": "${data.openGraph.image || `${data.url}/logo.png`}"
    },
    {
      "@type": "WebPage",
      "@id": "${data.url}#webpage",
      "url": "${data.url}",
      "name": "${data.title || 'Page Title'}",
      "isPartOf": { "@id": "${data.url}#organization" }
    }
  ]
}
</script>`
      });
    }

    const imagesCheck = tech.checks.find(c => c.id === 'tech-images-missing-alt');
    if (imagesCheck && data.images.missingAlt > 0) {
      addRec({
        id: 'rec-tech-3',
        title: `Remediate ${data.images.missingAlt} Missing Image Alt Attributes`,
        description: 'Provide descriptive alternative text for all informational and product images to improve accessibility and enable multimodal search indexation.',
        area: 'Technical',
        priority: 'P2',
        impact: 'Medium',
        effort: 'Low',
        confidence: 0.91,
        evidenceIds: [imagesCheck.id],
        evidenceDetails: [imagesCheck.evidence, `${data.images.missingAlt} of ${data.images.total} images lack alt attributes.`],
        recommendedAction: 'Audit HTML templates and add alt attributes describing image subject matter in 5–12 words.',
        codeSnippet: `<!-- Example fix -->\n<img src="/assets/hero-chart.png" alt="${entity.entities[0]?.entity || 'Product'} overview and analytical workflow diagram" />`
      });
    }

    // 2. Content & Search Intent Recommendations
    if (content.questionCoverageScore < 75) {
      addRec({
        id: 'rec-content-1',
        title: 'Implement Structured FAQ Section with Direct Answers',
        description: 'Add a dedicated Frequently Asked Questions module covering top natural language inquiries with concise 40-word declarative answer definitions.',
        area: 'Content',
        priority: 'P1',
        impact: 'High',
        effort: 'Medium',
        confidence: 0.89,
        evidenceIds: ['geo-dim-3', 'content-gap-faq'],
        evidenceDetails: [
          `Question coverage score: ${content.questionCoverageScore}/100.`,
          `Detected questions count: ${content.detectedQuestions.length}.`
        ],
        recommendedAction: 'Draft 4–6 high-frequency customer questions and pair each with a direct first sentence answer followed by supporting details.',
        codeSnippet: `<section id="faq">
  <h2>Frequently Asked Questions</h2>
  <h3>What services are included?</h3>
  <p>Our platform provides comprehensive automated auditing, technical health diagnostics, and generative AI search readiness scoring.</p>
</section>`
      });
    }

    if (content.topicCoverageScore < 75 || data.wordCount < 600) {
      addRec({
        id: 'rec-content-2',
        title: 'Deepen Topical Coverage and Empirical Proof Points',
        description: 'Expand textual depth with concrete benchmarks, statistical comparisons, and operational use-cases to satisfy commercial investigation search intent.',
        area: 'Content',
        priority: 'P2',
        impact: 'Medium',
        effort: 'Medium',
        confidence: 0.86,
        evidenceIds: ['geo-dim-4'],
        evidenceDetails: [
          `Current word count: ${data.wordCount} words.`,
          `Search intent: ${content.likelySearchIntent} (Confidence: ${Math.round(content.intentConfidence * 100)}%).`
        ],
        recommendedAction: 'Add 300+ words of structured technical specifications and comparative evaluation tables under dedicated H2 sections.'
      });
    }

    // 3. Entity & GEO Recommendations
    const answerDim = geo.dimensions.find(d => d.id === 'geo-dim-1');
    if (answerDim && answerDim.score < 18) {
      addRec({
        id: 'rec-geo-1',
        title: 'Optimize Section Lead Paragraphs for Direct AI Synthesis',
        description: 'Format opening paragraphs directly beneath H2 headers as self-contained declarative summaries so AI retrieval systems (RAG) can quote without semantic truncation.',
        area: 'GEO',
        priority: 'P1',
        impact: 'High',
        effort: 'Low',
        confidence: 0.92,
        evidenceIds: [answerDim.id],
        evidenceDetails: [answerDim.evidence, answerDim.reason],
        recommendedAction: 'Ensure every H2 section begins with an unambiguous 1–2 sentence definition containing subject, predicate, and core differentiator before conversational text.'
      });
    }

    const citationDim = geo.dimensions.find(d => d.id === 'geo-dim-6');
    if (citationDim && citationDim.score < 12) {
      addRec({
        id: 'rec-geo-2',
        title: 'Establish Authoritative Attribution & Source Citations',
        description: 'Include explicit publication dates, author credentials, and outbound references to authoritative industry benchmarks to boost generative AI citation probability.',
        area: 'GEO',
        priority: 'P2',
        impact: 'Medium',
        effort: 'Low',
        confidence: 0.88,
        evidenceIds: [citationDim.id],
        evidenceDetails: [citationDim.evidence, `External references: ${data.links.external}.`],
        recommendedAction: 'Add a metadata byline section including last updated timestamp, technical reviewer credentials, and links to official standards.'
      });
    }

    const entityRelRec = entity.relationships.length < 3;
    if (entityRelRec) {
      addRec({
        id: 'rec-entity-1',
        title: 'Explicate Entity Hierarchy & Brand Relationships',
        description: 'Clarify the parent organization, sub-brands, and distinct product categories in both on-page headings and SameAs semantic references.',
        area: 'Entity',
        priority: 'P2',
        impact: 'Medium',
        effort: 'Medium',
        confidence: 0.87,
        evidenceIds: ['entity-brand-1'],
        evidenceDetails: [
          `Identified entities: ${entity.entities.map(e => e.entity).join(', ')}.`,
          `Explicit relationships mapped: ${entity.relationships.length}.`
        ],
        recommendedAction: 'Link key brand mentions to external verified entities (Wikidata, LinkedIn, Crunchbase) using schema "sameAs" properties.'
      });
    }

    // Default fallback recommendation if page was near flawless
    if (rawRecs.length === 0) {
      addRec({
        id: 'rec-maint-1',
        title: 'Maintain Regular Schema & Entity Graph Validation',
        description: 'Continuously validate JSON-LD schemas against Schema.org updates and monitor AI search engine citation changes.',
        area: 'Technical',
        priority: 'P3',
        impact: 'Low',
        effort: 'Low',
        confidence: 0.95,
        evidenceIds: ['tech-schema-pass'],
        evidenceDetails: ['All baseline technical checks satisfied.'],
        recommendedAction: 'Schedule bi-weekly automated crawls to ensure no regressions in structured data or heading hierarchy.'
      });
    }

    return rawRecs;
  }
}
