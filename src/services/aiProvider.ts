import { 
  NormalizedPageData, 
  ContentAnalysisResult, 
  TechnicalSeoResult, 
  EntityAnalysisResult, 
  GeoAnalysisResult, 
  Recommendation, 
  EvaluationSummary,
  AuditSourceMode,
  AuditDataProvider
} from '../types';
import { ContentAnalyzer } from './contentAnalyzer';
import { RecommendationEngine } from './recommendationEngine';
import { EvaluationEngine } from './evaluationEngine';

export interface AIProvider {
  analyzeContentAndIntent(data: NormalizedPageData): Promise<ContentAnalysisResult>;
  generateRecommendations(
    data: NormalizedPageData,
    tech: TechnicalSeoResult,
    content: ContentAnalysisResult,
    entity: EntityAnalysisResult,
    geo: GeoAnalysisResult,
    sourceMode?: AuditSourceMode,
    dataProvider?: AuditDataProvider
  ): Promise<Recommendation[]>;
  evaluateRecommendations(recommendations: Recommendation[]): Promise<EvaluationSummary>;
}

export class GeminiAIProvider implements AIProvider {
  public async analyzeContentAndIntent(data: NormalizedPageData): Promise<ContentAnalysisResult> {
    const fallback = ContentAnalyzer.analyze(data);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'content_and_entities',
          payload: {
            title: data.title,
            metaDescription: data.metaDescription,
            headings: data.headings,
            wordCount: data.wordCount,
            visibleText: data.visibleText
          }
        })
      });

      if (!response.ok) return fallback;

      const result = await response.json();
      if (result.success && result.data && typeof result.data === 'object') {
        const aiData = result.data;
        // Validate required fields before assigning
        if (aiData.likelySearchIntent && typeof aiData.intentReason === 'string') {
          return {
            ...fallback,
            primaryTopic: aiData.primaryTopic || fallback.primaryTopic,
            likelySearchIntent: aiData.likelySearchIntent,
            intentConfidence: typeof aiData.intentConfidence === 'number' ? aiData.intentConfidence : fallback.intentConfidence,
            intentReason: aiData.intentReason || fallback.intentReason,
            contentGaps: Array.isArray(aiData.contentGaps) && aiData.contentGaps.length > 0 ? aiData.contentGaps : fallback.contentGaps,
            recommendedImprovements: Array.isArray(aiData.recommendedImprovements) && aiData.recommendedImprovements.length > 0 ? aiData.recommendedImprovements : fallback.recommendedImprovements
          };
        }
      }
    } catch {
      // Fallback silently on network or parse issue
    }

    return fallback;
  }

  public async generateRecommendations(
    data: NormalizedPageData,
    tech: TechnicalSeoResult,
    content: ContentAnalysisResult,
    entity: EntityAnalysisResult,
    geo: GeoAnalysisResult,
    sourceMode: AuditSourceMode = 'LIVE_URL',
    dataProvider: AuditDataProvider = 'LIVE_HTML'
  ): Promise<Recommendation[]> {
    // Generate deterministic evidence-backed recommendations with provenance
    return RecommendationEngine.generate(data, tech, content, entity, geo, sourceMode, dataProvider);
  }

  public async evaluateRecommendations(recommendations: Recommendation[]): Promise<EvaluationSummary> {
    return EvaluationEngine.evaluate(recommendations);
  }
}

export class OfflineDemoProvider implements AIProvider {
  public async analyzeContentAndIntent(data: NormalizedPageData): Promise<ContentAnalysisResult> {
    return ContentAnalyzer.analyze(data);
  }

  public async generateRecommendations(
    data: NormalizedPageData,
    tech: TechnicalSeoResult,
    content: ContentAnalysisResult,
    entity: EntityAnalysisResult,
    geo: GeoAnalysisResult,
    sourceMode: AuditSourceMode = 'LIVE_URL',
    dataProvider: AuditDataProvider = 'LIVE_HTML'
  ): Promise<Recommendation[]> {
    return RecommendationEngine.generate(data, tech, content, entity, geo, sourceMode, dataProvider);
  }

  public async evaluateRecommendations(recommendations: Recommendation[]): Promise<EvaluationSummary> {
    return EvaluationEngine.evaluate(recommendations);
  }
}

