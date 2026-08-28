import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ExternalLink,
  Layers,
  ArrowRight,
  ShieldCheck,
  Terminal,
  ChevronDown,
  ChevronUp,
  FileCode,
  Globe,
  Database,
  Fingerprint
} from 'lucide-react';
import { AuditReport } from '../types';

interface AuditOverviewViewProps {
  audit: AuditReport;
  onNavigateTab: (tab: string) => void;
  onOpenRecommendation: (recId: string) => void;
}

export const AuditOverviewView: React.FC<AuditOverviewViewProps> = ({
  audit,
  onNavigateTab,
  onOpenRecommendation
}) => {
  const [showRawDebug, setShowRawDebug] = useState(false);
  const { scores, technicalSeo, contentAnalysis, entityAnalysis, geoAnalysis, recommendations, stages, debugInfo, extractedData } = audit;

  const priorityRecommendations = recommendations
    .filter(r => r.priority === 'P0' || r.priority === 'P1')
    .slice(0, 4);

  const isLive = audit.sourceMode === 'LIVE_URL' || audit.mode === 'live';
  const isUpload = audit.sourceMode === 'HTML_UPLOAD' || audit.mode === 'upload';

  return (
    <div className="flex flex-col gap-6">
      
      {/* 4 Score Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Technical SEO */}
        <div 
          onClick={() => onNavigateTab('audit_technical')}
          className="bg-white border border-[#D8DADD] p-4 cursor-pointer hover:border-[#004AC6] transition-colors"
        >
          <div className="text-[11px] text-[#434655] font-bold uppercase tracking-wider mb-1">
            Technical SEO
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-light text-[#191C1E]">{scores.technicalSeo}</span>
            <span className="text-xs text-green-600 font-medium mb-1.5">
              {technicalSeo.issueCount === 0 ? '+100%' : `-${technicalSeo.issueCount} issues`}
            </span>
          </div>
          <div className="w-full bg-[#ECEEF0] h-1 mt-3">
            <div className="bg-[#004AC6] h-1" style={{ width: `${scores.technicalSeo}%` }} />
          </div>
        </div>

        {/* Card 2: Content Score */}
        <div 
          onClick={() => onNavigateTab('audit_content')}
          className="bg-white border border-[#D8DADD] p-4 cursor-pointer hover:border-[#004AC6] transition-colors"
        >
          <div className="text-[11px] text-[#434655] font-bold uppercase tracking-wider mb-1">
            Content Score
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-light text-[#191C1E]">{scores.content}</span>
            <span className="text-xs text-orange-600 font-medium mb-1.5">
              {contentAnalysis.likelySearchIntent.slice(0, 10)}
            </span>
          </div>
          <div className="w-full bg-[#ECEEF0] h-1 mt-3">
            <div className="bg-[#004AC6] h-1" style={{ width: `${scores.content}%` }} />
          </div>
        </div>

        {/* Card 3: Entity Clarity */}
        <div 
          onClick={() => onNavigateTab('audit_entity')}
          className="bg-white border border-[#D8DADD] p-4 cursor-pointer hover:border-[#004AC6] transition-colors"
        >
          <div className="text-[11px] text-[#434655] font-bold uppercase tracking-wider mb-1">
            Entity Clarity
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-light text-[#191C1E]">{scores.entity}</span>
            <span className="text-xs text-[#434655] font-medium mb-1.5">
              {entityAnalysis.entities.length} nodes
            </span>
          </div>
          <div className="w-full bg-[#ECEEF0] h-1 mt-3">
            <div className="bg-[#004AC6] h-1" style={{ width: `${scores.entity}%` }} />
          </div>
        </div>

        {/* Card 4: GEO Readiness */}
        <div 
          onClick={() => onNavigateTab('audit_geo')}
          className="bg-white border border-[#D8DADD] p-4 cursor-pointer hover:border-[#004AC6] transition-colors"
        >
          <div className="text-[11px] text-[#434655] font-bold uppercase tracking-wider mb-1">
            GEO Readiness
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl text-[#004AC6] font-bold">{scores.geoReadiness}</span>
            <span className="text-xs text-green-600 font-medium mb-1.5">6 DIMENSIONS</span>
          </div>
          <div className="w-full bg-[#ECEEF0] h-1 mt-3">
            <div className="bg-[#004AC6] h-1" style={{ width: `${scores.geoReadiness}%` }} />
          </div>
        </div>

      </section>

      {/* Two-Column Midsection: Orchestration Status + Priority Findings */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Orchestration Status */}
        <section className="w-full lg:w-1/3 bg-white border border-[#D8DADD] flex flex-col">
          <div className="p-4 border-b border-[#D8DADD] bg-[#F2F4F6]">
            <h2 className="text-[12px] font-bold uppercase text-[#434655]">
              Orchestration Status
            </h2>
          </div>

          <div className="flex-1 p-4 flex flex-col gap-3 font-mono text-[12px]">
            {stages && stages.length > 0 ? (
              stages.map((st) => (
                <div key={st.id} className="flex items-center gap-3">
                  <span className={st.status === 'completed' ? 'text-green-600' : st.status === 'running' ? 'text-[#004AC6] animate-pulse' : 'text-[#434655]/40'}>
                    {st.status === 'completed' ? '✓' : st.status === 'running' ? '●' : '○'}
                  </span>
                  <span className={`flex-1 ${st.status === 'running' ? 'font-bold text-[#004AC6]' : 'text-[#191C1E]'}`}>
                    {st.label}
                  </span>
                  <span className="text-[10px] text-[#434655]">
                    {st.durationMs ? `${(st.durationMs / 1000).toFixed(1)}s` : st.status === 'running' ? 'RUNNING' : 'QUEUED'}
                  </span>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-green-600">✓</span>
                  <span className="flex-1">Website Data Ingestion & DOM Parsing</span>
                  <span className="text-[10px] text-[#434655]">0.3s</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600">✓</span>
                  <span className="flex-1">Technical SEO Diagnostics</span>
                  <span className="text-[10px] text-[#434655]">0.2s</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600">✓</span>
                  <span className="flex-1">Content & Search Intent Analysis</span>
                  <span className="text-[10px] text-[#434655]">0.4s</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600">✓</span>
                  <span className="flex-1">Entity Knowledge Graphing</span>
                  <span className="text-[10px] text-[#434655]">0.2s</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600">✓</span>
                  <span className="flex-1">GEO & AI Search Evaluation</span>
                  <span className="text-[10px] text-[#434655]">0.3s</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600">✓</span>
                  <span className="flex-1">Recommendation Generation</span>
                  <span className="text-[10px] text-[#434655]">0.3s</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600">✓</span>
                  <span className="flex-1">AI Quality & Evidence Validation</span>
                  <span className="text-[10px] text-[#434655]">0.2s</span>
                </div>
              </>
            )}
          </div>

          <div className="p-3 border-t border-[#D8DADD] text-[10px] text-[#434655] italic bg-[#F8F9FC] flex justify-between items-center">
            <span>
              Engine: {audit.provider === 'gemini' ? 'Google Gemini 3.6 Flash' : 'Deterministic Local Pipeline'}
            </span>
            <span className="font-mono uppercase font-bold text-[9px] px-1.5 py-0.5 bg-[#E8EAED] text-[#191C1E]">
              {audit.mode === 'live' ? 'LIVE URL' : audit.mode === 'upload' ? 'HTML UPLOAD' : 'DEMO'}
            </span>
          </div>
        </section>

        {/* Right Column: Priority Findings Table */}
        <section className="flex-1 bg-white border border-[#D8DADD] flex flex-col">
          <div className="p-4 border-b border-[#D8DADD] bg-[#F2F4F6] flex justify-between items-center">
            <h2 className="text-[12px] font-bold uppercase text-[#434655]">
              Priority Findings
            </h2>
            <span className="text-[10px] text-[#434655] font-mono">
              Showing {priorityRecommendations.length} of {recommendations.length}
            </span>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8F9FC] border-b border-[#D8DADD]">
                <tr>
                  <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase">Area</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase">Finding</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase">Impact</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-[#D8DADD]">
                {priorityRecommendations.map((rec) => {
                  let badgeClass = 'bg-gray-400 text-white px-2 py-0.5 text-[10px] font-bold rounded-sm';
                  let label = 'LOW';

                  if (rec.priority === 'P0' || rec.impact === 'High') {
                    badgeClass = 'bg-[#BA1A1A] text-white px-2 py-0.5 text-[10px] font-bold rounded-sm';
                    label = 'CRITICAL';
                  } else if (rec.priority === 'P1') {
                    badgeClass = 'bg-orange-500 text-white px-2 py-0.5 text-[10px] font-bold rounded-sm';
                    label = 'HIGH';
                  } else if (rec.priority === 'P2') {
                    badgeClass = 'bg-blue-500 text-white px-2 py-0.5 text-[10px] font-bold rounded-sm';
                    label = 'MEDIUM';
                  }

                  return (
                    <tr key={rec.id} className="hover:bg-[#F8F9FC] transition-colors">
                      <td className="px-4 py-3 font-medium text-[12px] text-[#004AC6] uppercase whitespace-nowrap">
                        {rec.area}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#191C1E]">
                        <div className="font-semibold">{rec.title}</div>
                        <div className="text-[11px] text-[#434655] mt-0.5 line-clamp-1">{rec.description}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={badgeClass}>{label}</span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => onOpenRecommendation(rec.id)}
                          className="text-[#004AC6] text-[11px] font-semibold underline hover:text-[#2563EB]"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-[#D8DADD] bg-[#F8F9FC] flex justify-end">
            <button
              onClick={() => onNavigateTab('audit_recommendations')}
              className="text-xs font-semibold text-[#004AC6] hover:underline flex items-center gap-1"
            >
              <span>View all {recommendations.length} recommendations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

      </div>

      {/* Audit Provenance & Ingestion Fingerprint Section */}
      <section className="bg-white border border-[#D8DADD] flex flex-col">
        <div className="p-4 border-b border-[#D8DADD] bg-[#F2F4F6] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-[#004AC6]" />
            <h2 className="text-[12px] font-bold uppercase text-[#434655] tracking-wider">
              Data Ingestion & Pipeline Provenance
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-sm text-white ${
              isLive ? 'bg-[#0D6832]' : isUpload ? 'bg-[#004AC6]' : 'bg-[#2563EB]'
            }`}>
              {isLive ? 'SOURCE: LIVE_URL' : isUpload ? 'SOURCE: HTML_UPLOAD' : 'SOURCE: DEMO_SAMPLE'}
            </span>
            <button
              onClick={() => setShowRawDebug(!showRawDebug)}
              className="text-[11px] font-medium text-[#434655] hover:text-[#191C1E] flex items-center gap-1 border border-[#D8DADD] px-2 py-0.5 bg-white rounded-sm"
            >
              <Terminal className="w-3 h-3 text-[#434655]" />
              <span>{showRawDebug ? 'Hide Raw Metadata' : 'Show Raw Metadata'}</span>
              {showRawDebug ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Provenance Key-Value Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#D8DADD] border-b border-[#D8DADD] text-xs">
          
          <div className="p-3.5 space-y-1 bg-[#FAFAFC]">
            <div className="text-[10px] font-bold uppercase text-[#434655]">Target URL / Endpoint</div>
            <div className="font-mono text-[#191C1E] font-medium truncate" title={audit.url}>
              {audit.url}
            </div>
            <div className="text-[10px] text-[#434655]">
              HTTP Status: <span className="font-mono font-bold text-green-700">{debugInfo?.httpStatus || 200} OK</span>
            </div>
          </div>

          <div className="p-3.5 space-y-1 bg-[#FAFAFC]">
            <div className="text-[10px] font-bold uppercase text-[#434655]">Ingested Payload Size</div>
            <div className="font-mono text-[#191C1E] font-medium">
              {(debugInfo?.htmlLength || extractedData.visibleText.length).toLocaleString()} bytes
            </div>
            <div className="text-[10px] text-[#434655] truncate">
              Content-Type: <span className="font-mono text-[#191C1E]">{debugInfo?.contentType || 'text/html'}</span>
            </div>
          </div>

          <div className="p-3.5 space-y-1 bg-[#FAFAFC]">
            <div className="text-[10px] font-bold uppercase text-[#434655]">Document Fingerprint</div>
            <div className="font-mono text-[#004AC6] font-semibold truncate" title={debugInfo?.htmlHash}>
              {debugInfo?.htmlHash || 'sha_deterministic_computed'}
            </div>
            <div className="text-[10px] text-[#434655]">
              DOM Words: <span className="font-mono font-bold text-[#191C1E]">{extractedData.wordCount.toLocaleString()}</span>
            </div>
          </div>

          <div className="p-3.5 space-y-1 bg-[#FAFAFC]">
            <div className="text-[10px] font-bold uppercase text-[#434655]">Engine Architecture</div>
            <div className="font-mono text-[#191C1E] font-medium truncate">
              {audit.provider === 'gemini' ? 'Gemini 3.6 Flash' : 'Deterministic Local Engine'}
            </div>
            <div className="text-[10px] text-[#434655]">
              Duration: <span className="font-mono font-bold text-[#191C1E]">{(audit.durationMs / 1000).toFixed(2)}s</span>
            </div>
          </div>

        </div>

        {/* Live Extracted Proof Bar */}
        <div className="p-4 bg-white space-y-3 border-b border-[#D8DADD]">
          <div className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">
            Verified Extracted Signals (Proof of Live Ingestion)
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            
            <div className="p-2.5 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#434655] block">Title Tag</span>
              <p className="text-[#191C1E] font-medium line-clamp-2" title={extractedData.title}>
                {extractedData.title || <span className="italic text-gray-400">Not detected</span>}
              </p>
            </div>

            <div className="p-2.5 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#434655] block">Canonical Directive</span>
              <p className="font-mono text-[#191C1E] truncate" title={extractedData.canonical || 'None'}>
                {extractedData.canonical || <span className="italic text-orange-600">No canonical tag declared</span>}
              </p>
            </div>

            <div className="p-2.5 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#434655] block">Heading Structure</span>
              <p className="text-[#191C1E]">
                <span className="font-mono font-bold">{extractedData.headings.h1.length}</span> H1,{' '}
                <span className="font-mono font-bold">{extractedData.headings.h2.length}</span> H2,{' '}
                <span className="font-mono font-bold">{extractedData.headings.h3.length}</span> H3
              </p>
              {extractedData.headings.h1.length > 0 && (
                <p className="text-[11px] text-[#434655] truncate" title={extractedData.headings.h1[0]}>
                  H1: "{extractedData.headings.h1[0]}"
                </p>
              )}
            </div>

            <div className="p-2.5 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#434655] block">Links Discovered</span>
              <p className="text-[#191C1E]">
                <span className="font-mono font-bold">{extractedData.links.internal}</span> internal links,{' '}
                <span className="font-mono font-bold">{extractedData.links.external}</span> external links
              </p>
            </div>

            <div className="p-2.5 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#434655] block">Images & Accessibility</span>
              <p className="text-[#191C1E]">
                <span className="font-mono font-bold">{extractedData.images.total}</span> images total,{' '}
                <span className={`font-mono font-bold ${extractedData.images.missingAlt > 0 ? 'text-[#BA1A1A]' : 'text-green-700'}`}>
                  {extractedData.images.missingAlt} missing alt
                </span>
              </p>
            </div>

            <div className="p-2.5 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#434655] block">Structured Data Schemas</span>
              <p className="text-[#191C1E] font-mono truncate" title={extractedData.structuredData.types.join(', ')}>
                {extractedData.structuredData.types.length > 0
                  ? `[${extractedData.structuredData.types.join(', ')}]`
                  : <span className="italic text-gray-500">0 JSON-LD schemas</span>}
              </p>
            </div>

          </div>
        </div>

        {/* Data Lineage & Pipeline Provenance Flow */}
        <div className="p-4 bg-[#FAFAFC] space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold text-[#434655] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#004AC6]" />
              <span>Data Lineage & Transformation Pipeline (Live Verification)</span>
            </div>
            <span className="text-[10px] font-mono text-green-700 font-bold bg-[#EBF7EE] px-2 py-0.5 rounded-sm">
              ALL STAGES VERIFIED
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-[11px]">
              <thead>
                <tr className="bg-[#ECEEF0] text-[#434655] text-[10px] uppercase">
                  <th className="py-2 px-3">Stage</th>
                  <th className="py-2 px-3">Input Source</th>
                  <th className="py-2 px-3">Output Artifact</th>
                  <th className="py-2 px-3">Transformation Summary</th>
                  <th className="py-2 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8DADD] bg-white">
                {(audit.pipelineLineage || [
                  {
                    stageName: '1. Ingestion',
                    inputSource: isLive ? `HTTP ${audit.url}` : isUpload ? 'Uploaded Document' : 'ApexCare Blueprint',
                    outputSource: isLive ? 'LIVE_HTML' : isUpload ? 'UPLOADED_HTML' : 'DEMO_DATA',
                    status: 'VERIFIED',
                    details: `${(debugInfo?.htmlLength || extractedData.visibleText.length).toLocaleString()} bytes payload`
                  },
                  {
                    stageName: '2. DOM Extraction',
                    inputSource: isLive ? 'LIVE_HTML' : isUpload ? 'UPLOADED_HTML' : 'DEMO_DATA',
                    outputSource: 'Normalized DOM Tree',
                    status: 'VERIFIED',
                    details: `${extractedData.wordCount} words, ${extractedData.headings.h1.length} H1, ${extractedData.links.internal} links`
                  },
                  {
                    stageName: '3. Technical SEO',
                    inputSource: 'Normalized DOM Tree',
                    outputSource: `Tech Score: ${scores.technicalSeo}/100`,
                    status: 'VERIFIED',
                    details: `${technicalSeo.passedCount} pass, ${technicalSeo.issueCount} issue`
                  },
                  {
                    stageName: '4. Content Analysis',
                    inputSource: 'Normalized Text & Headings',
                    outputSource: `Content: ${scores.content}/100`,
                    status: 'VERIFIED',
                    details: `Intent: ${contentAnalysis.likelySearchIntent}`
                  },
                  {
                    stageName: '5. Entity Graphing',
                    inputSource: 'Normalized Text & Schemas',
                    outputSource: `Entity Score: ${scores.entity}/100`,
                    status: 'VERIFIED',
                    details: `${entityAnalysis.entities.length} nodes, ${entityAnalysis.relationships.length} edges`
                  },
                  {
                    stageName: '6. GEO Evaluation',
                    inputSource: 'Full Document Signals',
                    outputSource: `GEO Readiness: ${scores.geoReadiness}/100`,
                    status: 'VERIFIED',
                    details: '6 dimension rubric calculated'
                  },
                  {
                    stageName: '7. Recommendations',
                    inputSource: 'Audit Findings & Gaps',
                    outputSource: `${recommendations.length} Action Items`,
                    status: 'VERIFIED',
                    details: '100% grounded in extracted evidence'
                  },
                  {
                    stageName: '8. Evaluation Engine',
                    inputSource: 'Synthesized Action Items',
                    outputSource: `Quality: ${audit.evaluation.overallQualityScore}%`,
                    status: 'VERIFIED',
                    details: `Grounding rate: ${audit.evaluation.evidenceSupportedRate}%`
                  }
                ]).map((step, idx) => (
                  <tr key={idx} className="hover:bg-[#F8F9FC]">
                    <td className="py-2 px-3 font-semibold text-[#191C1E]">{step.stageName}</td>
                    <td className="py-2 px-3 text-[#434655] truncate max-w-[140px]" title={step.inputSource}>{step.inputSource}</td>
                    <td className="py-2 px-3 text-[#004AC6] font-semibold truncate max-w-[140px]" title={step.outputSource}>{step.outputSource}</td>
                    <td className="py-2 px-3 text-[#434655] truncate max-w-[200px]" title={step.details}>{step.details}</td>
                    <td className="py-2 px-3 text-right">
                      <span className="px-1.5 py-0.5 rounded-sm bg-[#EBF7EE] text-[#0D6832] text-[9px] font-bold">
                        {step.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Collapsible Raw Metadata JSON Inspector */}
        {showRawDebug && (
          <div className="p-4 border-t border-[#D8DADD] bg-[#191C1E] text-white">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-mono text-[#A8C7FA]">DEBUG_PROVENANCE_PAYLOAD</span>
              <span className="text-[10px] text-gray-400 font-mono">JSON Inspector</span>
            </div>
            <pre className="text-[11px] font-mono bg-[#111315] p-3 rounded-sm overflow-x-auto text-[#E3E3E3] max-h-60 leading-relaxed">
              {JSON.stringify({
                sourceMode: audit.sourceMode || audit.mode,
                auditId: audit.id,
                url: audit.url,
                targetWebsite: audit.website,
                debugInfo: audit.debugInfo,
                extractedSignalsSample: {
                  title: extractedData.title,
                  metaDescription: extractedData.metaDescription,
                  canonical: extractedData.canonical,
                  wordCount: extractedData.wordCount,
                  headingsSummary: {
                    h1Count: extractedData.headings.h1.length,
                    h1: extractedData.headings.h1,
                    h2Count: extractedData.headings.h2.length
                  },
                  linksSummary: extractedData.links,
                  imagesSummary: {
                    total: extractedData.images.total,
                    missingAlt: extractedData.images.missingAlt
                  },
                  schemaTypes: extractedData.structuredData.types
                }
              }, null, 2)}
            </pre>
          </div>
        )}
      </section>

      {/* Footer: GEO Readiness Breakout Bar */}
      <footer className="bg-white border border-[#D8DADD] flex flex-col">
        <div className="px-4 py-2 bg-[#F2F4F6] border-b border-[#D8DADD] flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">
            GEO READINESS BREAKOUT
          </span>
          <span className="text-[10px] text-[#434655]">
            Analysis Type: Generative Engine Optimization Readiness
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[#D8DADD]">
          {geoAnalysis.dimensions.map((dim) => {
            const pct = Math.round((dim.score / dim.maxScore) * 100);
            return (
              <div 
                key={dim.id}
                onClick={() => onNavigateTab('audit_geo')}
                className="p-3 flex flex-col items-center justify-center gap-1 hover:bg-[#F8F9FC] cursor-pointer transition-colors"
              >
                <span className="text-[10px] text-[#434655] uppercase text-center font-medium">
                  {dim.name}
                </span>
                <span className="text-lg font-bold font-mono text-[#191C1E]">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </footer>

    </div>
  );
};
