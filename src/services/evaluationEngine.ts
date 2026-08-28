import { Recommendation, RecommendationEvaluation, EvaluationSummary } from '../types';

export class EvaluationEngine {
  public static evaluate(recommendations: Recommendation[]): EvaluationSummary {
    if (!recommendations || recommendations.length === 0) {
      return {
        overallQualityScore: 0,
        evidenceSupportedRate: 0,
        actionabilityRate: 0,
        specificityRate: 0,
        duplicateRate: 0,
        evaluations: []
      };
    }

    const evaluations: RecommendationEvaluation[] = [];
    const seenTitles = new Set<string>();

    recommendations.forEach(rec => {
      // 1. Evidence Supported Validation
      const hasEvidence = rec.evidenceDetails && rec.evidenceDetails.length > 0 && rec.evidenceIds && rec.evidenceIds.length > 0;
      const evidenceSupported = hasEvidence && rec.evidenceDetails.some(d => d.trim().length > 10);

      // 2. Actionability Check
      const actionText = (rec.recommendedAction || '').toLowerCase();
      const hasActionVerbs = /\b(add|insert|implement|shorten|expand|remediate|embed|audit|ensure|link|draft|declare)\b/i.test(actionText);
      const actionable = actionText.length > 20 && hasActionVerbs;

      // 3. Specificity Check
      const isSpecific = (rec.title.length > 15) && 
                         (rec.description.length > 40) &&
                         (Boolean(rec.codeSnippet) || rec.description.includes('Schema') || rec.description.includes('H2') || rec.description.includes('canonical') || rec.description.includes('FAQ') || rec.description.includes('alt') || rec.description.includes('words'));

      // 4. Relevance
      const relevant = ['Technical', 'Content', 'Entity', 'GEO'].includes(rec.area) && rec.confidence >= 0.70;

      // 5. Duplicate Check
      const normalizedTitle = rec.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      const duplicate = seenTitles.has(normalizedTitle);
      seenTitles.add(normalizedTitle);

      // Confidence computation
      let score = 0;
      if (evidenceSupported) score += 0.35;
      if (actionable) score += 0.25;
      if (isSpecific) score += 0.20;
      if (relevant) score += 0.15;
      if (!duplicate) score += 0.05;

      let feedback = '';
      if (!evidenceSupported) {
        feedback = 'Recommendation lacks direct link to observable extracted evidence.';
      } else if (!actionable) {
        feedback = 'Action phrasing could be made more imperative with concrete steps.';
      } else if (!isSpecific) {
        feedback = 'Recommendation would benefit from code snippet or markup example.';
      } else {
        feedback = 'Passed all validation criteria with verified evidence anchors and high actionability.';
      }

      const evidenceVerification = evidenceSupported 
        ? `Verified against ${rec.evidenceIds.join(', ')} (${rec.evidenceDetails[0]?.slice(0, 75)}...)`
        : 'Warning: Unable to verify direct empirical anchor.';

      evaluations.push({
        recommendationId: rec.id,
        recommendationTitle: rec.title,
        evidenceSupported,
        actionable,
        specific: isSpecific,
        relevant,
        duplicate,
        confidence: Number(score.toFixed(2)),
        feedback,
        evidenceVerification
      });
    });

    const total = evaluations.length;
    const evidenceSupportedCount = evaluations.filter(e => e.evidenceSupported).length;
    const actionableCount = evaluations.filter(e => e.actionable).length;
    const specificCount = evaluations.filter(e => e.specific).length;
    const duplicateCount = evaluations.filter(e => e.duplicate).length;

    const evidenceSupportedRate = Math.round((evidenceSupportedCount / total) * 100);
    const actionabilityRate = Math.round((actionableCount / total) * 100);
    const specificityRate = Math.round((specificCount / total) * 100);
    const duplicateRate = Math.round((duplicateCount / total) * 100);

    const avgConfidence = evaluations.reduce((sum, e) => sum + e.confidence, 0) / total;
    const overallQualityScore = Math.round(avgConfidence * 100);

    return {
      overallQualityScore,
      evidenceSupportedRate,
      actionabilityRate,
      specificityRate,
      duplicateRate,
      evaluations
    };
  }
}
