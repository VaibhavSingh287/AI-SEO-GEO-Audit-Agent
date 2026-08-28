import { AuditReport, NormalizedPageData } from '../types';

export const DEMO_HTML_APEXCARE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ApexCare Insurance - Comprehensive Healthcare Plans for Teams & Families</title>
  <meta name="description" content="Explore affordable health, dental, and vision insurance solutions designed for modern enterprise teams, small businesses, and growing families with 24/7 telehealth support.">
  <meta property="og:title" content="ApexCare Insurance - Modern Health Coverage">
  <meta property="og:description" content="Discover flexible health benefit plans and telehealth services tailored for teams.">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="ApexCare Health Plans">
  <meta property="og:image" content="https://apexcare-demo.internal/assets/og-cover.png">
  <meta name="robots" content="index, follow">
  <!-- Note: Canonical tag is deliberately omitted for audit demonstration -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "ApexCare Advantage Health Plan",
    "description": "Comprehensive health insurance plan with nationwide network access and integrated telemedicine.",
    "category": "Health Insurance"
  }
  </script>
</head>
<body>
  <header>
    <nav>
      <a href="/plans">Health Plans</a>
      <a href="/telehealth">Telehealth 24/7</a>
      <a href="/providers">Find a Doctor</a>
      <a href="/quote">Get an Instant Quote</a>
      <a href="/contact">Contact Support</a>
    </nav>
  </header>

  <main>
    <h1>Comprehensive Health Insurance Coverage for Teams & Families</h1>
    <p>ApexCare Insurance delivers flexible medical, dental, and prescription drug plans tailored to small enterprises, remote workforces, and self-employed individuals across all 50 states.</p>

    <img src="/assets/hero-doctor.jpg" alt="Telehealth physician consulting with patient online">
    <img src="/assets/coverage-chart.png"> <!-- Missing Alt deliberate -->
    <img src="/assets/partner-logos.png" alt="Accredited hospital network partners">
    <img src="/assets/app-preview.png"> <!-- Missing Alt deliberate -->

    <section>
      <h2>Why Choose ApexCare Health Plans?</h2>
      <p>ApexCare provides nationwide network access with over 850,000 participating doctors, clinics, and hospital facilities. Our members save an average of 28% on annual prescription costs and enjoy zero-copay virtual consultations.</p>
      
      <h3>Nationwide In-Network Medical Providers</h3>
      <p>Connect with board-certified primary care physicians and specialists without needing referrals under our PPO framework.</p>

      <h3>Integrated 24/7 Telemedicine Support</h3>
      <p>Access on-demand virtual urgent care visits directly through iOS and Android mobile apps in under 15 minutes.</p>
    </section>

    <section>
      <h2>Compare Our Healthcare Plan Tiers</h2>
      <p>Whether you need basic catastrophic protection or low-deductible family coverage, compare our transparent bronze, silver, and gold tiers with clear out-of-pocket maximums.</p>
      <p>Pricing starts at $189/month for individual policies and $540/month for comprehensive small group coverage.</p>
    </section>

    <section>
      <h2>Frequently Asked Questions</h2>
      <p>What is the annual deductible for ApexCare Silver Plans?</p>
      <p>The standard in-network individual deductible is $1,500, with a family cap of $3,000 per policy year.</p>
      <p>How does telehealth billing work for preventative visits?</p>
      <p>Preventative wellness exams and routine consultations are 100% covered with zero out-of-pocket copay.</p>
    </section>
  </main>

  <footer>
    <p>&copy; 2026 ApexCare Insurance Group. Headquartered in Austin, Texas. Regulated by National Healthcare Standards.</p>
    <a href="/privacy">Privacy Policy</a>
    <a href="/terms">Terms of Service</a>
    <a href="/sitemap.xml">XML Sitemap</a>
    <a href="https://healthcare.gov" target="_blank" rel="noopener">Official Healthcare Guidelines</a>
  </footer>
</body>
</html>`;

export function getDemoAuditReport(id: string = 'audit-demo-apexcare'): AuditReport {
  const extractedData: NormalizedPageData = {
    url: 'https://apexcare-health-demo.internal',
    title: 'ApexCare Insurance - Comprehensive Healthcare Plans for Teams & Families',
    metaDescription: 'Explore affordable health, dental, and vision insurance solutions designed for modern enterprise teams, small businesses, and growing families with 24/7 telehealth support.',
    canonical: null,
    robots: 'index, follow',
    headings: {
      h1: ['Comprehensive Health Insurance Coverage for Teams & Families'],
      h2: ['Why Choose ApexCare Health Plans?', 'Compare Our Healthcare Plan Tiers', 'Frequently Asked Questions'],
      h3: ['Nationwide In-Network Medical Providers', 'Integrated 24/7 Telemedicine Support']
    },
    links: {
      internal: 8,
      external: 1,
      urls: ['/plans', '/telehealth', '/providers', '/quote', '/contact', '/privacy', '/terms', '/sitemap.xml']
    },
    images: {
      total: 4,
      missingAlt: 2,
      items: [
        { src: '/assets/hero-doctor.jpg', alt: 'Telehealth physician consulting with patient online', hasAlt: true },
        { src: '/assets/coverage-chart.png', alt: '', hasAlt: false },
        { src: '/assets/partner-logos.png', alt: 'Accredited hospital network partners', hasAlt: true },
        { src: '/assets/app-preview.png', alt: '', hasAlt: false }
      ]
    },
    structuredData: {
      types: ['Product'],
      raw: [
        {
          '@context': 'https://schema.org',
          '@type': 'Product',
          'name': 'ApexCare Advantage Health Plan',
          'description': 'Comprehensive health insurance plan with nationwide network access.',
          'category': 'Health Insurance'
        }
      ]
    },
    openGraph: {
      title: 'ApexCare Insurance - Modern Health Coverage',
      description: 'Discover flexible health benefit plans and telehealth services tailored for teams.',
      type: 'website',
      siteName: 'ApexCare Health Plans',
      image: 'https://apexcare-demo.internal/assets/og-cover.png'
    },
    language: 'en',
    viewport: 'width=device-width, initial-scale=1.0',
    wordCount: 485,
    visibleText: 'Comprehensive Health Insurance Coverage for Teams & Families ApexCare Insurance delivers flexible medical, dental, and prescription drug plans tailored to small enterprises, remote workforces, and self-employed individuals across all 50 states...'
  };

  return {
    id,
    website: 'ApexCare Health Insurance',
    url: 'https://apexcare-health-demo.internal',
    createdAt: '2026-08-19T05:45:00.000Z',
    mode: 'demo',
    sourceMode: 'DEMO',
    provider: 'offline_demo',
    durationMs: 1420,
    scores: {
      overallSeo: 78,
      technicalSeo: 82,
      content: 74,
      entity: 69,
      geoReadiness: 64,
      aiSearchReadiness: 61
    },
    extractedData,
    technicalSeo: {
      score: 82,
      passedCount: 7,
      warningCount: 2,
      issueCount: 1,
      summary: 'Technical analysis verified 10 deterministic on-page signals. Found 1 critical issue (missing canonical tag) and 2 warnings (missing image alt tags and missing Organization JSON-LD).',
      checks: [
        {
          id: 'tech-title-pass',
          name: 'Page Title Tag',
          category: 'On-Page',
          status: 'PASS',
          scoreWeight: 10,
          scoreAwarded: 10,
          finding: 'Title length is optimal (73 characters, descriptive entity anchor).',
          evidence: 'Extracted title: "ApexCare Insurance - Comprehensive Healthcare Plans for Teams & Families"'
        },
        {
          id: 'tech-meta-desc-pass',
          name: 'Meta Description',
          category: 'On-Page',
          status: 'PASS',
          scoreWeight: 10,
          scoreAwarded: 10,
          finding: 'Meta description is within ideal range (163 characters).',
          evidence: 'Extracted meta description: "Explore affordable health, dental, and vision insurance solutions..."'
        },
        {
          id: 'tech-h1-pass',
          name: 'H1 Primary Heading',
          category: 'Structure',
          status: 'PASS',
          scoreWeight: 10,
          scoreAwarded: 10,
          finding: 'Single primary H1 heading detected with clear semantic topic.',
          evidence: 'H1: "Comprehensive Health Insurance Coverage for Teams & Families"'
        },
        {
          id: 'tech-heading-pass',
          name: 'Heading Structure & Hierarchy',
          category: 'Structure',
          status: 'PASS',
          scoreWeight: 10,
          scoreAwarded: 10,
          finding: 'Document exhibits clear heading hierarchy across 3 H2 and 2 H3 subheadings.',
          evidence: 'Structure breakdown: 1 H1, 3 H2s, 2 H3s across 485 words.'
        },
        {
          id: 'tech-canonical-missing',
          name: 'Canonical Tag Specification',
          category: 'Indexability',
          status: 'ISSUE',
          scoreWeight: 10,
          scoreAwarded: 4,
          finding: 'No canonical URL link tag detected in document <head>.',
          evidence: '<link rel="canonical"> is not declared in <head>.',
          recommendedFix: 'Add <link rel="canonical" href="https://apexcare-health-demo.internal" /> to prevent duplicate query parameter indexation.'
        },
        {
          id: 'tech-robots-pass',
          name: 'Robots Indexability Directive',
          category: 'Indexability',
          status: 'PASS',
          scoreWeight: 10,
          scoreAwarded: 10,
          finding: 'Robots meta allows indexing (no blocking directives).',
          evidence: 'Robots directive: "index, follow".'
        },
        {
          id: 'tech-images-missing-alt',
          name: 'Image Alt Attributes',
          category: 'Images',
          status: 'WARNING',
          scoreWeight: 10,
          scoreAwarded: 5,
          finding: '2 of 4 images are missing descriptive alt attributes.',
          evidence: 'Missing alt count: 2 / 4 (50% unannotated). Files: coverage-chart.png, app-preview.png.',
          recommendedFix: 'Add descriptive alt text specifying data visualized in coverage chart and mobile interface.'
        },
        {
          id: 'tech-links-pass',
          name: 'Internal Linking Signals',
          category: 'Links',
          status: 'PASS',
          scoreWeight: 10,
          scoreAwarded: 10,
          finding: 'Healthy internal linking distribution (8 links detected).',
          evidence: 'Internal links: 8, External links: 1.'
        },
        {
          id: 'tech-schema-partial',
          name: 'Structured Data / JSON-LD',
          category: 'Structured Data',
          status: 'WARNING',
          scoreWeight: 10,
          scoreAwarded: 6,
          finding: 'Product schema detected, but core Organization schema is missing.',
          evidence: 'Detected JSON-LD types: Product. Organization schema not detected.',
          recommendedFix: 'Add Organization schema defining official name, headquarters, logo, and customer service contactPoint.'
        },
        {
          id: 'tech-og-pass',
          name: 'Open Graph & Social Discovery',
          category: 'Social',
          status: 'PASS',
          scoreWeight: 10,
          scoreAwarded: 10,
          finding: 'Complete Open Graph metadata tags detected.',
          evidence: 'Configured OG tags: title, description, type, siteName, image.'
        }
      ]
    },
    contentAnalysis: {
      primaryTopic: 'Comprehensive Health Insurance Coverage for Teams & Families',
      likelySearchIntent: 'Commercial Investigation',
      intentConfidence: 0.88,
      intentReason: 'Content combines evaluation indicators ("compare plan tiers", "deductibles", "850,000 participating doctors") with clear conversion calls ("get a quote", "pricing starts at $189/mo").',
      topicCoverageScore: 74,
      questionCoverageScore: 68,
      structureScore: 80,
      overallContentScore: 74,
      contentGaps: [
        'FAQ section is formatted as standard text paragraphs without Schema.org FAQPage markup.',
        'Text depth is moderate (485 words); deeper technical coverage of state-specific plan nuances would improve AI retrieval authority.',
        'Lack of tabular comparison markup for tier deductibles and copay structures.'
      ],
      detectedQuestions: [
        'Why Choose ApexCare Health Plans?',
        'What is the annual deductible for ApexCare Silver Plans?',
        'How does telehealth billing work for preventative visits?'
      ],
      searchIntentAlignment: 'Content structure matches Commercial Investigation intent profile with 88% topical alignment.',
      recommendedImprovements: [
        'Convert the pricing and tier comparison section into a responsive semantic <table>.',
        'Wrap FAQ questions into FAQPage JSON-LD structured data for voice and AI search snippets.',
        'Include customer satisfaction metrics or state insurance accreditation badge citations.'
      ]
    },
    entityAnalysis: {
      score: 69,
      summary: 'Identified 4 core knowledge graph entities with 3 explicit conceptual relationships. Organization schema is missing, limiting automatic entity disambiguation for generative search engines.',
      entities: [
        {
          id: 'entity-brand-1',
          entity: 'ApexCare Insurance Group',
          type: 'Organization',
          confidence: 0.86,
          clarity: 0.72,
          description: 'Primary health insurance organization extracted from title, OpenGraph, and footer disclosures.',
          evidence: 'Extracted from page title "ApexCare Insurance" and footer copyright (no Organization JSON-LD declared).'
        },
        {
          id: 'entity-svc-1',
          entity: 'ApexCare Advantage Health Plan',
          type: 'Product',
          confidence: 0.94,
          clarity: 0.90,
          description: 'Primary health benefit tier explicitly declared via Product schema markup.',
          evidence: 'Found in JSON-LD script (@type: Product, name: "ApexCare Advantage Health Plan").'
        },
        {
          id: 'entity-cat-1',
          entity: 'HEALTH INSURANCE',
          type: 'Category',
          confidence: 0.88,
          clarity: 0.84,
          description: 'Core industry vertical repeatedly referenced across headings and plan descriptions.',
          evidence: 'Occurs 7 times across body text, meta description, and schema category.'
        },
        {
          id: 'entity-loc-1',
          entity: 'Austin, Texas',
          type: 'Location',
          confidence: 0.82,
          clarity: 0.78,
          description: 'Corporate headquarters location stated in footer disclosure.',
          evidence: 'Footer statement: "Headquartered in Austin, Texas."'
        }
      ],
      relationships: [
        { source: 'ApexCare Insurance Group', target: 'ApexCare Advantage Health Plan', relationship: 'underwrites / provides' },
        { source: 'ApexCare Advantage Health Plan', target: 'HEALTH INSURANCE', relationship: 'operates within industry vertical' },
        { source: 'ApexCare Insurance Group', target: 'Austin, Texas', relationship: 'headquartered in' }
      ]
    },
    geoAnalysis: {
      score: 64,
      summary: 'GEO analysis evaluated 6 observable AI-search content dimensions, yielding a calculated score of 64/100. Entity grounding and conversational FAQ structure represent key optimization opportunities.',
      dimensions: [
        {
          id: 'geo-dim-1',
          name: 'Answer Clarity & Directness',
          score: 13,
          maxScore: 20,
          reason: 'Opening paragraph defines core target demographics and services, but lacks a concise 30-word bullet summary.',
          evidence: 'Primary H1 is followed by a multi-clause introductory paragraph.'
        },
        {
          id: 'geo-dim-2',
          name: 'Entity Clarity & Disambiguation',
          score: 12,
          maxScore: 20,
          reason: 'Product schema is present, but missing Organization schema lowers machine entity certainty.',
          evidence: 'JSON-LD types: [Product]. Missing Organization schema.'
        },
        {
          id: 'geo-dim-3',
          name: 'Question Coverage & Natural Language Q&A',
          score: 10,
          maxScore: 15,
          reason: 'FAQ section contains 2 direct questions, but they are not tagged with FAQPage schema.',
          evidence: 'Detected 2 questions in FAQ section without structured data.'
        },
        {
          id: 'geo-dim-4',
          name: 'Factual Structure & Data Density',
          score: 11,
          maxScore: 15,
          reason: 'Specific metrics provided (850,000 doctors, 28% savings, $189/mo starting price, $1,500 deductible).',
          evidence: '4 verifiable numerical data points present in body copy.'
        },
        {
          id: 'geo-dim-5',
          name: 'Structured Information & Chunk Extractability',
          score: 10,
          maxScore: 15,
          reason: 'Hierarchical H2 and H3 headers facilitate clean chunking, though tabular comparison data is missing.',
          evidence: '3 H2s and 2 H3s present in document flow.'
        },
        {
          id: 'geo-dim-6',
          name: 'Citation & Reference Potential',
          score: 8,
          maxScore: 15,
          reason: 'Includes 1 external link to healthcare.gov, but lacks author credentials and dateModified stamps.',
          evidence: 'External links: 1 (healthcare.gov). No dateModified timestamp detected.'
        }
      ],
      findings: [
        'Specific numerical proof points (850,000 providers, 28% savings) enhance factual extractability.',
        'Missing Organization schema limits brand authority in AI knowledge graphs.',
        'Absence of FAQPage JSON-LD reduces conversational AI snippet eligibility.',
        'Lead paragraphs require more concise direct answers for LLM summarization.'
      ],
      opportunities: [
        'Deploy Schema.org Organization markup with official legal name, logo, and state accreditation credentials.',
        'Add Schema.org FAQPage structured data to the existing FAQ questions.',
        'Insert a canonical URL tag (<link rel="canonical">) to consolidate domain indexing signals.',
        'Provide descriptive alt text for coverage-chart.png and app-preview.png images.'
      ]
    },
    recommendations: [
      {
        id: 'rec-tech-1',
        title: 'Specify Canonical URL Directive',
        description: 'Declare a self-referencing canonical URL in the HTML head to prevent duplicate URL tracking and consolidate link equity across query parameters.',
        area: 'Technical',
        priority: 'P0',
        impact: 'High',
        effort: 'Low',
        confidence: 0.96,
        evidenceIds: ['tech-canonical-missing'],
        evidenceDetails: [
          '<link rel="canonical"> is not declared in <head>.',
          'No canonical URL link tag detected in document <head>.'
        ],
        recommendedAction: 'Insert <link rel="canonical" href="https://apexcare-health-demo.internal" /> in <head>.',
        codeSnippet: '<link rel="canonical" href="https://apexcare-health-demo.internal" />'
      },
      {
        id: 'rec-tech-2',
        title: 'Deploy Organization & WebPage JSON-LD Schema',
        description: 'Incorporate Schema.org structured data to explicitly define organization identity, official name, brand logo, and social profile links for machine entity resolution.',
        area: 'Technical',
        priority: 'P0',
        impact: 'High',
        effort: 'Medium',
        confidence: 0.95,
        evidenceIds: ['tech-schema-partial', 'entity-brand-1'],
        evidenceDetails: [
          'Detected JSON-LD types: [Product]. Organization schema not detected.',
          'Brand entity extracted from text heuristics rather than explicit schema.'
        ],
        recommendedAction: 'Add a JSON-LD script block defining Organization and WebPage entities at the root layout level.',
        codeSnippet: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://apexcare-health-demo.internal#organization",
      "name": "ApexCare Insurance Group",
      "url": "https://apexcare-health-demo.internal",
      "logo": "https://apexcare-demo.internal/assets/og-cover.png",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Austin",
        "addressRegion": "TX",
        "addressCountry": "US"
      }
    }
  ]
}
</script>`
      },
      {
        id: 'rec-tech-3',
        title: 'Remediate 2 Missing Image Alt Attributes',
        description: 'Provide descriptive alternative text for coverage-chart.png and app-preview.png to improve accessibility and enable multimodal search indexation.',
        area: 'Technical',
        priority: 'P2',
        impact: 'Medium',
        effort: 'Low',
        confidence: 0.91,
        evidenceIds: ['tech-images-missing-alt'],
        evidenceDetails: [
          'Missing alt count: 2 / 4 (50% unannotated).',
          'Images missing alt tags: /assets/coverage-chart.png, /assets/app-preview.png.'
        ],
        recommendedAction: 'Update <img> tags with descriptive alt attributes explaining the plan comparison breakdown and telemedicine user interface.',
        codeSnippet: '<img src="/assets/coverage-chart.png" alt="ApexCare plan comparison tier chart showing bronze, silver, and gold deductibles" />'
      },
      {
        id: 'rec-content-1',
        title: 'Implement Structured FAQ Section with Direct Answers',
        description: 'Add Schema.org FAQPage structured data to existing questions and provide 40-word direct answers for conversational AI search citation.',
        area: 'Content',
        priority: 'P1',
        impact: 'High',
        effort: 'Medium',
        confidence: 0.89,
        evidenceIds: ['geo-dim-3'],
        evidenceDetails: [
          'Detected 2 questions in FAQ section without structured data.',
          'Question coverage score: 68/100.'
        ],
        recommendedAction: 'Annotate the FAQ section with FAQPage schema and expand with 2 additional questions on provider networks.',
        codeSnippet: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the annual deductible for ApexCare Silver Plans?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The standard in-network individual deductible is $1,500, with a family cap of $3,000 per policy year."
      }
    }
  ]
}
</script>`
      },
      {
        id: 'rec-geo-1',
        title: 'Optimize Section Lead Paragraphs for Direct AI Synthesis',
        description: 'Format opening paragraphs directly beneath H2 headers as self-contained declarative summaries so AI retrieval systems (RAG) can quote without semantic truncation.',
        area: 'GEO',
        priority: 'P1',
        impact: 'High',
        effort: 'Low',
        confidence: 0.92,
        evidenceIds: ['geo-dim-1'],
        evidenceDetails: [
          'Primary H1 is followed by a multi-clause introductory paragraph.',
          'Opening paragraph score: 13/20 in Answer Clarity.'
        ],
        recommendedAction: 'Ensure every H2 section begins with an unambiguous 1–2 sentence definition containing subject, predicate, and core differentiator.'
      }
    ],
    evaluation: {
      overallQualityScore: 92,
      evidenceSupportedRate: 100,
      actionabilityRate: 100,
      specificityRate: 100,
      duplicateRate: 0,
      evaluations: [
        {
          recommendationId: 'rec-tech-1',
          recommendationTitle: 'Specify Canonical URL Directive',
          evidenceSupported: true,
          actionable: true,
          specific: true,
          relevant: true,
          duplicate: false,
          confidence: 0.96,
          feedback: 'Passed all validation criteria with verified evidence anchors and high actionability.',
          evidenceVerification: 'Verified against tech-canonical-missing (<link rel="canonical"> is not declared in <head>)'
        },
        {
          recommendationId: 'rec-tech-2',
          recommendationTitle: 'Deploy Organization & WebPage JSON-LD Schema',
          evidenceSupported: true,
          actionable: true,
          specific: true,
          relevant: true,
          duplicate: false,
          confidence: 0.95,
          feedback: 'Passed all validation criteria with verified evidence anchors and high actionability.',
          evidenceVerification: 'Verified against tech-schema-partial (Detected JSON-LD types: [Product]...)'
        },
        {
          recommendationId: 'rec-tech-3',
          recommendationTitle: 'Remediate 2 Missing Image Alt Attributes',
          evidenceSupported: true,
          actionable: true,
          specific: true,
          relevant: true,
          duplicate: false,
          confidence: 0.91,
          feedback: 'Passed all validation criteria with verified evidence anchors and high actionability.',
          evidenceVerification: 'Verified against tech-images-missing-alt (Missing alt count: 2 / 4...)'
        },
        {
          recommendationId: 'rec-content-1',
          recommendationTitle: 'Implement Structured FAQ Section with Direct Answers',
          evidenceSupported: true,
          actionable: true,
          specific: true,
          relevant: true,
          duplicate: false,
          confidence: 0.89,
          feedback: 'Passed all validation criteria with verified evidence anchors and high actionability.',
          evidenceVerification: 'Verified against geo-dim-3 (Detected 2 questions in FAQ section...)'
        },
        {
          recommendationId: 'rec-geo-1',
          recommendationTitle: 'Optimize Section Lead Paragraphs for Direct AI Synthesis',
          evidenceSupported: true,
          actionable: true,
          specific: true,
          relevant: true,
          duplicate: false,
          confidence: 0.92,
          feedback: 'Passed all validation criteria with verified evidence anchors and high actionability.',
          evidenceVerification: 'Verified against geo-dim-1 (Primary H1 is followed by a multi-clause introductory paragraph...)'
        }
      ]
    },
    stages: [
      { id: 'stage-ingest', label: 'Website Data Ingestion & DOM Parsing', status: 'completed', durationMs: 120 },
      { id: 'stage-tech', label: 'Technical SEO Diagnostics', status: 'completed', durationMs: 140 },
      { id: 'stage-content', label: 'Content & Search Intent Analysis', status: 'completed', durationMs: 230 },
      { id: 'stage-entity', label: 'Entity Knowledge Graphing', status: 'completed', durationMs: 190 },
      { id: 'stage-geo', label: 'GEO & AI Search Evaluation', status: 'completed', durationMs: 280 },
      { id: 'stage-rec', label: 'Recommendation Generation', status: 'completed', durationMs: 210 },
      { id: 'stage-eval', label: 'AI Quality & Evidence Validation', status: 'completed', durationMs: 155 }
    ],
    debugInfo: {
      sourceMode: 'DEMO',
      requestedUrl: 'https://apexcare-health-demo.internal',
      finalUrl: 'https://apexcare-health-demo.internal',
      fetchStatus: 'LOCAL_DEMO',
      httpStatus: 200,
      contentType: 'text/html; charset=UTF-8',
      htmlLength: DEMO_HTML_APEXCARE.length,
      htmlHash: 'sha_apexcare_demo',
      dataProvider: 'DEMO_DATA',
      technicalProvider: 'DEMO_DATA',
      contentProvider: 'DEMO_DATA',
      entityProvider: 'DEMO_DATA',
      geoProvider: 'DEMO_DATA',
      recommendationProvider: 'DEMO_DATA',
      durationMs: 1420,
      extractedProof: {
        title: 'ApexCare Insurance - Comprehensive Healthcare Plans for Teams & Families',
        metaDescription: 'Explore affordable health, dental, and vision insurance solutions designed for modern enterprise teams, small businesses, and growing families with 24/7 telehealth support.',
        canonical: 'Not detected (Omitted for demo)',
        h1Count: 1,
        h1List: ['Comprehensive Health Insurance Coverage for Teams & Families'],
        h2Count: 3,
        internalLinks: 8,
        externalLinks: 1,
        imagesCount: 4,
        missingAltCount: 2,
        jsonLdTypes: ['Product'],
        wordCount: 485
      }
    }
  };
}
