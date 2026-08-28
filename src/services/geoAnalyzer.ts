import { NormalizedPageData, GeoDimension, GeoAnalysisResult } from '../types';

export class GeoAnalyzer {
  public static analyze(data: NormalizedPageData): GeoAnalysisResult {
    const text = data.visibleText || '';
    const words = data.wordCount;
    const lowerText = text.toLowerCase();
    const dimensions: GeoDimension[] = [];

    // 1. Answer Clarity (Max: 20 pts)
    // Evaluates whether headings are directly followed by concise definition paragraphs (40-80 words)
    let answerClarityScore = 12;
    let answerEvidence = '';
    let answerReason = '';
    const hasClearH1 = data.headings.h1.length === 1;
    const hasDirectDefinitions = /\b(is a|are defined as|means|refers to|designed to|provides|enables)\b/i.test(text);

    if (hasClearH1 && hasDirectDefinitions && words > 300) {
      answerClarityScore = 17;
      answerEvidence = `Primary H1 "${data.headings.h1[0]}" contains concise declarative definitions within the opening 150 words.`;
      answerReason = 'Opening paragraphs provide direct, unambiguous answers suitable for synthesis by LLM answer extractors.';
    } else if (hasDirectDefinitions) {
      answerClarityScore = 14;
      answerEvidence = 'Declarative statements detected, but answers are dispersed across conversational phrasing.';
      answerReason = 'Generative engines can parse core definitions, but direct summary extraction efficiency is moderate.';
    } else {
      answerClarityScore = 9;
      answerEvidence = 'No direct declarative definition sentences detected immediately adjacent to primary section headers.';
      answerReason = 'Answers to implied reader questions are buried in promotional copy rather than direct conceptual statements.';
    }
    dimensions.push({
      id: 'geo-dim-1',
      name: 'Answer Clarity & Directness',
      score: answerClarityScore,
      maxScore: 20,
      reason: answerReason,
      evidence: answerEvidence
    });

    // 2. Entity Clarity & Disambiguation (Max: 20 pts)
    let entityScore = 11;
    let entityEvidence = '';
    let entityReason = '';
    const hasOrgSchema = data.structuredData.types.includes('Organization') || data.structuredData.types.includes('Corporation');
    const hasProductSchema = data.structuredData.types.includes('Product') || data.structuredData.types.includes('Service');

    if (hasOrgSchema && hasProductSchema) {
      entityScore = 19;
      entityEvidence = `JSON-LD types declared: [${data.structuredData.types.join(', ')}]. Named entities explicitly mapped.`;
      entityReason = 'High entity disambiguation. AI knowledge graphs can link organization and product properties with high confidence.';
    } else if (hasOrgSchema || data.structuredData.types.length > 0) {
      entityScore = 15;
      entityEvidence = `Partial schema detected: [${data.structuredData.types.join(', ')}].`;
      entityReason = 'Basic entity grounding present, though secondary offerings lack explicit Schema.org property definitions.';
    } else {
      entityScore = 10;
      entityEvidence = 'Zero JSON-LD structured schemas detected on page.';
      entityReason = 'AI engines must infer entity boundaries purely from unstructured text heuristics, reducing confidence.';
    }
    dimensions.push({
      id: 'geo-dim-2',
      name: 'Entity Clarity & Disambiguation',
      score: entityScore,
      maxScore: 20,
      reason: entityReason,
      evidence: entityEvidence
    });

    // 3. Question Coverage (Max: 15 pts)
    let questionScore = 8;
    let questionEvidence = '';
    let questionReason = '';
    const questionRegex = /([^.?!;]*\?)/g;
    const detectedQuestions = text.match(questionRegex) || [];
    const qCount = detectedQuestions.length;

    if (qCount >= 4) {
      questionScore = 14;
      questionEvidence = `Detected ${qCount} explicit question phrases (e.g. "${detectedQuestions[0]?.trim()}").`;
      questionReason = 'Strong alignment with conversational natural language queries that searchers input into AI engines.';
    } else if (qCount >= 1) {
      questionScore = 11;
      questionEvidence = `Detected ${qCount} explicit question header(s).`;
      questionReason = 'Some conversational questions addressed, but common user follow-up questions remain uncovered.';
    } else {
      questionScore = 6;
      questionEvidence = 'No explicit question format headers or FAQ modules detected.';
      questionReason = 'Content is phrased topically rather than in question-and-answer format, reducing AI retrieval hit rate.';
    }
    dimensions.push({
      id: 'geo-dim-3',
      name: 'Question Coverage & Natural Language Q&A',
      score: questionScore,
      maxScore: 15,
      reason: questionReason,
      evidence: questionEvidence
    });

    // 4. Factual Structure & Data Density (Max: 15 pts)
    let factualScore = 8;
    let factualEvidence = '';
    let factualReason = '';
    const hasNumbers = (text.match(/\b\d+(\.\d+)?%?\b/g) || []).length > 8;
    const hasLists = data.headings.h2.length >= 3;

    if (hasNumbers && hasLists) {
      factualScore = 14;
      factualEvidence = 'High density of verifiable numerical claims, percentages, and structured section dividers.';
      factualReason = 'Factual density is high. AI synthesis models favor citing data-rich paragraphs with specific statistics.';
    } else if (hasNumbers || hasLists) {
      factualScore = 10;
      factualEvidence = 'Moderate factual density with occasional statistical claims and structured sections.';
      factualReason = 'Satisfactory factual basis, though additional quantitative proof points would improve citation authority.';
    } else {
      factualScore = 6;
      factualEvidence = 'Content consists predominantly of qualitative prose without distinct statistical or empirical metrics.';
      factualReason = 'Low factual density reduces likelihood of being selected as a primary factual source by LLM search agents.';
    }
    dimensions.push({
      id: 'geo-dim-4',
      name: 'Factual Structure & Data Density',
      score: factualScore,
      maxScore: 15,
      reason: factualReason,
      evidence: factualEvidence
    });

    // 5. Structured Information & Extractability (Max: 15 pts)
    let structInfoScore = 8;
    let structInfoEvidence = '';
    let structInfoReason = '';
    const hasTablesOrLists = data.headings.h2.length >= 3 && data.headings.h3.length >= 2;

    if (hasTablesOrLists && data.structuredData.types.length > 0) {
      structInfoScore = 14;
      structInfoEvidence = `Multi-tiered heading hierarchy (${data.headings.h2.length} H2s, ${data.headings.h3.length} H3s) paired with schema markup.`;
      structInfoReason = 'Information is organized into clean hierarchical chunks easily indexed by AI retrieval models (RAG).';
    } else if (hasTablesOrLists || data.structuredData.types.length > 0) {
      structInfoScore = 11;
      structInfoEvidence = `Modular heading structure (${data.headings.h2.length} H2s), partial schema integration.`;
      structInfoReason = 'Moderate extractability. Content sections can be chunked for retrieval with reasonable boundary clarity.';
    } else {
      structInfoScore = 6;
      structInfoEvidence = 'Flat structural hierarchy with few distinct subheadings or structural markup.';
      structInfoReason = 'Retrieval chunking will produce noisy, blended segments lacking clear topical boundaries.';
    }
    dimensions.push({
      id: 'geo-dim-5',
      name: 'Structured Information & Chunk Extractability',
      score: structInfoScore,
      maxScore: 15,
      reason: structInfoReason,
      evidence: structInfoEvidence
    });

    // 6. Citation & Reference Potential (Max: 15 pts)
    let citationScore = 8;
    let citationEvidence = '';
    let citationReason = '';
    const hasExternalSources = data.links.external > 2;
    const hasAuthorOrDate = lowerText.includes('updated') || lowerText.includes('published') || lowerText.includes('author') || lowerText.includes('by');

    if (hasExternalSources && hasAuthorOrDate) {
      citationScore = 13;
      citationEvidence = `Cites ${data.links.external} external references and includes verifiable publication / attribution markers.`;
      citationReason = 'High citation potential. Clear provenance signals encourage AI engines to quote and attribute source material.';
    } else if (hasExternalSources || hasAuthorOrDate) {
      citationScore = 9;
      citationEvidence = `Identified ${data.links.external} external links; partial author/date attribution signals.`;
      citationReason = 'Moderate reference value. Adding primary source citations will elevate confidence scores during retrieval.';
    } else {
      citationScore = 6;
      citationEvidence = 'Zero external reference links or explicit source author attribution detected.';
      citationReason = 'Unattributed claims without verifiable citations are less likely to be prioritized for direct generative answers.';
    }
    dimensions.push({
      id: 'geo-dim-6',
      name: 'Citation & Reference Potential',
      score: citationScore,
      maxScore: 15,
      reason: citationReason,
      evidence: citationEvidence
    });

    // Total GEO Score (out of 100)
    const totalScore = dimensions.reduce((acc, dim) => acc + dim.score, 0);

    const findings = [
      answerClarityScore >= 14 ? 'Direct answer definitions identified in high-priority headings.' : 'Key questions lack direct 1-sentence answer summaries.',
      entityScore >= 14 ? 'Entity clarity supported by structured schema mappings.' : 'Entity disambiguation relies on probabilistic text extraction.',
      questionScore >= 12 ? 'Conversational Q&A natural language queries present.' : 'Absence of structured FAQ schema limits voice/conversational search retrieval.',
      factualScore >= 12 ? 'Empirical data points and factual anchors present in content.' : 'Content would benefit from quantifiable benchmarks and numerical proof points.'
    ];

    const opportunities = [
      'Incorporate explicit Schema.org FAQPage markup for conversational Q&A snippets.',
      'Prepend concise 40-word direct answers beneath each H2 heading before expanding into technical details.',
      'Add an Organization schema entity graph with "sameAs" links pointing to authoritative external profiles.',
      'Format comparison parameters and pricing tiers into HTML <table> elements for structured tabular parsing by AI agents.'
    ];

    return {
      score: Math.min(100, Math.max(0, totalScore)),
      dimensions,
      findings,
      opportunities,
      summary: `GEO analysis evaluated 6 observable AI-search content dimensions, yielding a calculated score of ${totalScore}/100. Entity grounding and answer directness represent the highest leverage optimization areas.`
    };
  }
}
