import React from 'react';
import { 
  Printer, 
  Download, 
  FileText
} from 'lucide-react';
import { AuditReport } from '../types';
import { StorageService } from '../services/storage';

interface ReportViewProps {
  audit: AuditReport;
}

export const ReportView: React.FC<ReportViewProps> = ({ audit }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    StorageService.exportAuditJson(audit);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      
      {/* Actions Toolbar - Hidden in Print */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D8DADD] print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#004AC6]" />
            <h1 className="text-xl font-bold text-[#191C1E] tracking-tight">Executive Audit Report</h1>
          </div>
          <p className="text-xs text-[#434655] mt-0.5">
            Complete technical SEO, semantic entity, and AI search readiness deliverable formatted for stakeholders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D8DADD] hover:bg-[#F2F4F6] text-[#191C1E] text-xs font-semibold rounded-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#004AC6] hover:bg-[#2563EB] text-white text-xs font-semibold rounded-sm shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div className="bg-white border border-[#D8DADD] rounded-sm p-6 sm:p-8 space-y-6 shadow-xs print:border-none print:shadow-none print:p-0">
        
        {/* Report Header */}
        <div className="border-b border-[#D8DADD] pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#004AC6] mb-1">
              AI SEO & GEO Intelligence Audit Report
            </div>
            <h2 className="text-2xl font-bold text-[#191C1E] tracking-tight">
              {audit.website}
            </h2>
            <div className="text-xs font-mono text-[#434655] mt-1">
              {audit.url}
            </div>
          </div>

          <div className="text-xs text-[#434655] sm:text-right space-y-0.5 font-mono">
            <div><strong>Audit ID:</strong> {audit.id}</div>
            <div><strong>Date:</strong> {new Date(audit.createdAt).toLocaleDateString()} {new Date(audit.createdAt).toLocaleTimeString()}</div>
            <div><strong>Mode:</strong> {audit.mode.toUpperCase()} ({audit.durationMs}ms)</div>
          </div>
        </div>

        {/* Executive Score Summary */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#191C1E] mb-3">
            1. Executive Score Summary
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 bg-[#F8F9FC] border border-[#004AC6] rounded-sm text-center">
              <div className="text-[10px] font-bold text-[#004AC6] uppercase">Overall SEO</div>
              <div className="text-2xl font-bold font-mono text-[#191C1E] mt-1">{audit.scores.overallSeo}</div>
            </div>

            <div className="p-3 bg-white border border-[#D8DADD] rounded-sm text-center">
              <div className="text-[10px] font-bold text-[#434655] uppercase">Technical SEO</div>
              <div className="text-2xl font-bold font-mono text-[#191C1E] mt-1">{audit.scores.technicalSeo}</div>
            </div>

            <div className="p-3 bg-white border border-[#D8DADD] rounded-sm text-center">
              <div className="text-[10px] font-bold text-[#434655] uppercase">Content Score</div>
              <div className="text-2xl font-bold font-mono text-[#191C1E] mt-1">{audit.scores.content}</div>
            </div>

            <div className="p-3 bg-white border border-[#D8DADD] rounded-sm text-center">
              <div className="text-[10px] font-bold text-[#434655] uppercase">Entity Signals</div>
              <div className="text-2xl font-bold font-mono text-[#191C1E] mt-1">{audit.scores.entity}</div>
            </div>

            <div className="p-3 bg-white border border-[#D8DADD] rounded-sm text-center">
              <div className="text-[10px] font-bold text-[#004AC6] uppercase">GEO Readiness</div>
              <div className="text-2xl font-bold font-mono text-[#004AC6] mt-1">{audit.scores.geoReadiness}</div>
            </div>
          </div>
        </div>

        {/* Technical SEO Findings */}
        <div className="border-t border-[#D8DADD] pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#191C1E] mb-3">
            2. Deterministic Technical SEO Findings
          </h3>
          <p className="text-xs text-[#434655] mb-3 leading-relaxed">
            {audit.technicalSeo.summary}
          </p>

          <div className="space-y-2">
            {audit.technicalSeo.checks.map(c => (
              <div key={c.id} className="p-2.5 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm text-xs flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-sm font-mono ${
                      c.status === 'PASS' ? 'bg-[#EBF7EE] text-[#0D6832]' : c.status === 'WARNING' ? 'bg-[#FFF8E6] text-[#B26A00]' : 'bg-[#FDF2F2] text-[#BA1A1A]'
                    }`}>
                      {c.status}
                    </span>
                    <strong className="text-[#191C1E]">{c.name}</strong>
                  </div>
                  <div className="text-[#434655] mt-1">{c.finding}</div>
                  <div className="text-[11px] font-mono text-[#434655]/80 mt-0.5">Anchor: {c.evidence}</div>
                </div>
                <div className="font-mono text-[11px] text-[#434655] whitespace-nowrap">
                  {c.scoreAwarded}/{c.scoreWeight} pts
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content & Search Intent */}
        <div className="border-t border-[#D8DADD] pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#191C1E] mb-3">
            3. Content Analysis & Search Intent
          </h3>
          
          <div className="p-3 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm text-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#191C1E]">Classified Intent:</span>
              <span className="px-2 py-0.5 rounded-sm bg-[#004AC6] text-white font-semibold text-[11px]">
                {audit.contentAnalysis.likelySearchIntent} ({Math.round(audit.contentAnalysis.intentConfidence * 100)}%)
              </span>
            </div>
            <div className="text-[#434655] leading-relaxed">
              {audit.contentAnalysis.intentReason}
            </div>
          </div>
        </div>

        {/* GEO / AI Search Dimensions */}
        <div className="border-t border-[#D8DADD] pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#191C1E] mb-3">
            4. GEO / AI Search Readiness Dimensions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {audit.geoAnalysis.dimensions.map(d => (
              <div key={d.id} className="p-2.5 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm space-y-1">
                <div className="flex items-center justify-between font-semibold text-[#191C1E]">
                  <span>{d.name}</span>
                  <span className="font-mono">{d.score}/{d.maxScore}</span>
                </div>
                <p className="text-[#434655] text-[11px]">{d.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="border-t border-[#D8DADD] pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#191C1E] mb-3">
            5. Actionable Implementation Directives ({audit.recommendations.length})
          </h3>

          <div className="space-y-3">
            {audit.recommendations.map(r => (
              <div key={r.id} className="p-3 border border-[#D8DADD] rounded-sm text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[10px] px-1.5 py-0.2 rounded-sm bg-[#191C1E] text-white">
                      {r.priority}
                    </span>
                    <span className="font-bold text-[#191C1E]">{r.title}</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#434655]">
                    Impact: {r.impact} | Effort: {r.effort}
                  </span>
                </div>
                <p className="text-[#434655]">{r.description}</p>
                <div className="p-2 bg-[#EBF7EE]/40 border border-[#BDE7C8] rounded-sm text-[#191C1E] font-medium text-[11px]">
                  <strong>Action:</strong> {r.recommendedAction}
                </div>
                {r.codeSnippet && (
                  <div className="p-2 bg-[#191C1E] text-[#ECEEF0] font-mono text-[10px] rounded-sm overflow-x-auto">
                    <pre>{r.codeSnippet}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendation Quality Evaluation */}
        <div className="border-t border-[#D8DADD] pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#191C1E] mb-3">
            6. Quality & Grounding Evaluation
          </h3>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm">
              <div className="text-[10px] text-[#434655]">Quality Score</div>
              <div className="font-bold font-mono text-[#0D6832] text-lg">{audit.evaluation.overallQualityScore}%</div>
            </div>
            <div className="p-2 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm">
              <div className="text-[10px] text-[#434655]">Evidence Grounding</div>
              <div className="font-bold font-mono text-[#191C1E] text-lg">{audit.evaluation.evidenceSupportedRate}%</div>
            </div>
            <div className="p-2 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm">
              <div className="text-[10px] text-[#434655]">Actionability</div>
              <div className="font-bold font-mono text-[#191C1E] text-lg">{audit.evaluation.actionabilityRate}%</div>
            </div>
            <div className="p-2 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm">
              <div className="text-[10px] text-[#434655]">Specificity</div>
              <div className="font-bold font-mono text-[#191C1E] text-lg">{audit.evaluation.specificityRate}%</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
