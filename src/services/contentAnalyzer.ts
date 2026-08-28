import { NormalizedPageData, ContentAnalysisResult, SearchIntent } from '../types';

export class ContentAnalyzer {
  public static analyze(data: NormalizedPageData): ContentAnalysisResult {
    const text = data.visibleText || '';
    const words = data.wordCount;
    const lowerText = text.toLowerCase();
    const headingsText = [...data.headings.h1, ...data.headings.h2, ...data.headings.h3].join(' ').toLowerCase();

    // 1. Primary Topic Detection
    let primaryTopic = data.title.split(/[-|•—]/)[0]?.trim() || 'General Enterprise Services';
    if (data.headings.h1.length > 0) {
      primaryTopic = data.headings.h1[0];
    }

    // 2. Search Intent Classification
    let likelySearchIntent: SearchIntent = 'Informational';
    let intentConfidence = 0.82;
    let intentReason = '';

    const hasTransactionalWords = /\b(buy|pricing|order|cart|checkout|subscribe|sign up|quote|book now|plans)\b/i.test(text);
    const hasCommercialWords = /\b(best|top|vs|review|comparison|features|benefits|solutions|compare)\b/i.test(text);
    const hasLocalWords = /\b(near me|locations|address|hours|directions|call us|branch|office|city)\b/i.test(text);
    const hasInformationalWords = /\b(what is|how to|guide|explained|tips|overview|understanding|learn)\b/i.test(text);

    if (hasTransactionalWords && hasCommercialWords) {
      likelySearchIntent = 'Commercial Investigation';
      intentConfidence = 0.88;
      intentReason = `Content combines evaluation triggers ("compare", "features", "solutions") with call-to-actions ("pricing", "plans"), indicating high-intent product evaluation.`;
    } else if (hasTransactionalWords) {
      likelySearchIntent = 'Transactional';
      intentConfidence = 0.85;
      intentReason = `Direct conversion actions ("quote", "subscribe", "pricing") detected across primary navigation and body sections.`;
    } else if (hasLocalWords && (lowerText.includes('phone') || lowerText.includes('location') || lowerText.includes('address'))) {
      likelySearchIntent = 'Local';
      intentConfidence = 0.80;
      intentReason = `Physical location cues and localized contact indicators detected in page body.`;
    } else if (hasInformationalWords || words > 600) {
      likelySearchIntent = 'Informational';
      intentConfidence = 0.86;
      intentReason = `Long-form expository structure and informational inquiry phrases ("how", "guide", "overview") dominant.`;
    } else {
      likelySearchIntent = 'Commercial Investigation';
      intentConfidence = 0.76;
      intentReason = `Page presents brand solutions and feature offerings structured for prospective enterprise buyers.`;
    }

    // 3. Question Coverage
    const questionRegex = /([^.?!;]*\?)/g;
    const detectedQuestions: string[] = [];
    let match;
    while ((match = questionRegex.exec(text)) !== null) {
      const q = match[1].trim();
      if (q.length > 15 && q.length < 160 && !detectedQuestions.includes(q)) {
        detectedQuestions.push(q);
      }
    }
    // Also check headings starting with What, How, Why, Can, Is
    [...data.headings.h2, ...data.headings.h3].forEach(h => {
      if (/^(what|how|why|can|is|which|when|who|where|do|does)\b/i.test(h) && !detectedQuestions.includes(h)) {
        detectedQuestions.push(h.endsWith('?') ? h : `${h}?`);
      }
    });

    const questionCount = detectedQuestions.length;
    let questionCoverageScore = 50;
    if (questionCount >= 5) questionCoverageScore = 92;
    else if (questionCount >= 3) questionCoverageScore = 80;
    else if (questionCount >= 1) questionCoverageScore = 65;
    else questionCoverageScore = 42;

    // 4. Topic Coverage Score
    let topicCoverageScore = 60;
    if (words > 1200 && data.headings.h2.length >= 4) {
      topicCoverageScore = 90;
    } else if (words > 700 && data.headings.h2.length >= 3) {
      topicCoverageScore = 78;
    } else if (words > 350) {
      topicCoverageScore = 68;
    } else {
      topicCoverageScore = 48;
    }

    // 5. Structure Score
    let structureScore = 70;
    if (data.headings.h1.length === 1 && data.headings.h2.length >= 3 && data.headings.h3.length >= 2) {
      structureScore = 94;
    } else if (data.headings.h2.length >= 2) {
      structureScore = 82;
    } else {
      structureScore = 55;
    }

    // 6. Content Gaps & Improvements
    const contentGaps: string[] = [];
    const recommendedImprovements: string[] = [];

    if (questionCount < 3) {
      contentGaps.push('Frequently Asked Questions (FAQ) section answering direct user queries is absent or sparse.');
      recommendedImprovements.push('Add an explicit FAQ section using FAQPage structured schema and concise, direct answers for LLM citation parsing.');
    }

    if (words < 500) {
      contentGaps.push(`Low textual depth (${words} words). AI engines favor pages with clear semantic depth and comprehensive topic definitions.`);
      recommendedImprovements.push('Expand core topic coverage to 750+ words, including clear terminology definitions, use cases, and comparative data points.');
    }

    if (!lowerText.includes('example') && !lowerText.includes('case study') && !lowerText.includes('data')) {
      contentGaps.push('Lack of concrete empirical proof points, real-world examples, or quantifiable benchmark statistics.');
      recommendedImprovements.push('Include verifiable statistics, concrete examples, and structured data tables to boost AI citation indexability.');
    }

    if (data.headings.h3.length === 0 && data.headings.h2.length > 0) {
      contentGaps.push('Shallow subtopic division (no H3 subheadings for modular concept extraction).');
      recommendedImprovements.push('Nest H3 subsections under key H2 headers to create granular snippet extraction targets.');
    }

    const overallContentScore = Math.round(
      topicCoverageScore * 0.35 +
      questionCoverageScore * 0.30 +
      structureScore * 0.35
    );

    return {
      primaryTopic,
      likelySearchIntent,
      intentConfidence,
      intentReason,
      topicCoverageScore,
      questionCoverageScore,
      structureScore,
      overallContentScore,
      contentGaps: contentGaps.slice(0, 4),
      detectedQuestions: detectedQuestions.slice(0, 6),
      searchIntentAlignment: `Content structure matches ${likelySearchIntent} intent profile with ${Math.round(intentConfidence * 100)}% topical alignment.`,
      recommendedImprovements: recommendedImprovements.slice(0, 4)
    };
  }
}
