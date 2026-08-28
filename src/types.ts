export type SearchIntent = 
  | 'Informational'
  | 'Navigational'
  | 'Commercial Investigation'
  | 'Transactional'
  | 'Local';

export type PriorityLevel = 'P0' | 'P1' | 'P2' | 'P3';
export type ImpactLevel = 'High' | 'Medium' | 'Low';
export type EffortLevel = 'Low' | 'Medium' | 'High';
export type CheckStatus = 'PASS' | 'WARNING' | 'ISSUE';
export type AuditArea = 'Technical' | 'Content' | 'Entity' | 'GEO';
export type EntityType = 
  | 'Organization'
  | 'Product'
  | 'Service'
  | 'Location'
  | 'Person'
  | 'Brand'
  | 'Category'
  | 'Other';

export interface ImageDetail {
  src: string;
  alt: string;
  hasAlt: boolean;
}

export interface NormalizedPageData {
  url: string;
  title: string;
  metaDescription: string;
  canonical: string | null;
  robots: string | null;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  links: {
    internal: number;
    external: number;
    urls: string[];
  };
  images: {
    total: number;
    missingAlt: number;
    items?: ImageDetail[];
  };
  structuredData: {
    types: string[];
    raw: Record<string, unknown>[];
  };
  openGraph: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
    siteName?: string;
    [key: string]: string | undefined;
  };
  language: string | null;
  viewport: string | null;
  wordCount: number;
  visibleText: string;
}

export interface TechnicalScoreBreakdown {
  title: number;
  metaDescription: number;
  h1: number;
  headingStructure: number;
  canonical: number;
  robots: number;
  internalLinks: number;
  imagesAlt: number;
  structuredData: number;
  openGraph: number;
  total: number;
}

export interface TechnicalCheck {
  id: string;
  name: string;
  category: 'Indexability' | 'On-Page' | 'Structure' | 'Links' | 'Images' | 'Structured Data' | 'Social';
  status: CheckStatus;
  scoreWeight: number;
  scoreAwarded: number;
  finding: string;
  evidence: string;
  recommendedFix?: string;
  sourceMode?: AuditSourceMode;
  dataProvider?: AuditDataProvider;
}

export interface TechnicalSeoResult {
  score: number;
  scoreBreakdown?: TechnicalScoreBreakdown;
  checks: TechnicalCheck[];
  passedCount: number;
  warningCount: number;
  issueCount: number;
  summary: string;
}

export interface ContentAnalysisResult {
  primaryTopic: string;
  likelySearchIntent: SearchIntent;
  intentConfidence: number;
  intentReason: string;
  topicCoverageScore: number;
  questionCoverageScore: number;
  structureScore: number;
  overallContentScore: number;
  contentGaps: string[];
  detectedQuestions: string[];
  searchIntentAlignment: string;
  recommendedImprovements: string[];
}

export interface EntityItem {
  id: string;
  entity: string;
  type: EntityType;
  confidence: number;
  clarity: number;
  description: string;
  evidence: string;
}

export interface EntityRelationship {
  source: string;
  target: string;
  relationship: string;
}

export interface EntityAnalysisResult {
  score: number;
  entities: EntityItem[];
  relationships: EntityRelationship[];
  summary: string;
}

export interface GeoDimension {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  reason: string;
  evidence: string;
}

export interface GeoAnalysisResult {
  score: number;
  dimensions: GeoDimension[];
  findings: string[];
  opportunities: string[];
  summary: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  area: AuditArea;
  priority: PriorityLevel;
  impact: ImpactLevel;
  effort: EffortLevel;
  confidence: number;
  evidenceIds: string[];
  evidenceDetails: string[];
  recommendedAction: string;
  codeSnippet?: string;
  sourceMode?: AuditSourceMode;
  dataProvider?: AuditDataProvider;
  sourceFindingIds?: string[];
}

export interface RecommendationEvaluation {
  recommendationId: string;
  recommendationTitle: string;
  evidenceSupported: boolean;
  actionable: boolean;
  specific: boolean;
  relevant: boolean;
  duplicate: boolean;
  confidence: number;
  feedback: string;
  evidenceVerification: string;
}

export interface EvaluationSummary {
  overallQualityScore: number;
  evidenceSupportedRate: number;
  actionabilityRate: number;
  specificityRate: number;
  duplicateRate: number;
  evaluations: RecommendationEvaluation[];
}

export type AuditStageStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface AuditStageInfo {
  id: string;
  label: string;
  status: AuditStageStatus;
  durationMs?: number;
  error?: string;
  details?: string;
}

export interface AuditScores {
  overallSeo: number;
  technicalSeo: number;
  content: number;
  entity: number;
  geoReadiness: number;
  aiSearchReadiness: number;
}

export type AuditSourceMode = 'LIVE_URL' | 'HTML_UPLOAD' | 'DEMO';
export type AuditDataProvider = 'LIVE_HTML' | 'UPLOADED_HTML' | 'DEMO_DATA';
export type AuditAiEngine = 'GEMINI' | 'LOCAL_DETERMINISTIC' | 'DEMO_DATA';

export interface PipelineStageLineage {
  stageName: string;
  inputSource: string;
  outputSource: string;
  status: 'VERIFIED' | 'DEMO' | 'FAILED';
  details?: string;
}

export interface AuditDebugInfo {
  sourceMode: AuditSourceMode;
  requestedUrl?: string;
  finalUrl?: string;
  fetchStatus: 'SUCCESS' | 'FAILED' | 'LOCAL_DEMO';
  httpStatus?: number;
  contentType?: string;
  htmlLength: number;
  htmlHash: string;
  dataProvider: AuditDataProvider;
  technicalProvider: 'LIVE_HTML_ANALYSIS' | 'DEMO_DATA';
  contentProvider: 'GEMINI' | 'LOCAL_DETERMINISTIC' | 'DEMO_DATA';
  entityProvider: 'LIVE_HTML_ANALYSIS' | 'DEMO_DATA';
  geoProvider: 'LIVE_HTML_ANALYSIS' | 'GEMINI' | 'DEMO_DATA';
  recommendationProvider: 'LIVE_FINDINGS' | 'DEMO_DATA';
  durationMs?: number;
  stageLineage?: PipelineStageLineage[];
  extractedProof?: {
    title: string;
    metaDescription: string;
    canonical: string;
    h1Count: number;
    h1List: string[];
    h2Count: number;
    internalLinks: number;
    externalLinks: number;
    imagesCount: number;
    missingAltCount: number;
    jsonLdTypes: string[];
    wordCount: number;
  };
}

export interface AuditReport {
  id: string;
  website: string;
  url: string;
  createdAt: string;
  mode: 'demo' | 'live' | 'upload';
  sourceMode?: AuditSourceMode;
  provider?: 'gemini' | 'offline_demo';
  durationMs: number;
  scores: AuditScores;
  extractedData: NormalizedPageData;
  technicalSeo: TechnicalSeoResult;
  contentAnalysis: ContentAnalysisResult;
  entityAnalysis: EntityAnalysisResult;
  geoAnalysis: GeoAnalysisResult;
  recommendations: Recommendation[];
  evaluation: EvaluationSummary;
  stages: AuditStageInfo[];
  debugInfo?: AuditDebugInfo;
  pipelineLineage?: PipelineStageLineage[];
}

export interface AuditConfiguration {
  runTechnical: boolean;
  runContent: boolean;
  runEntity: boolean;
  runGeo: boolean;
  runEvaluation: boolean;
}

export interface AppSettings {
  demoMode: boolean;
  aiProvider: 'gemini' | 'offline_demo';
  includeEvidence: boolean;
  includeAiEvaluation: boolean;
}
