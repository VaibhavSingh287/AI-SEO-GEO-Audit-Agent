import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Lightbulb, 
  Info,
  BarChart2
} from 'lucide-react';
import { GeoAnalysisResult } from '../types';

interface GeoViewProps {
  geoAnalysis: GeoAnalysisResult;
}

export const GeoView: React.FC<GeoViewProps> = ({ geoAnalysis }) => {
  return (
    <div className="flex flex-col gap-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D8DADD]">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#004AC6]" />
            <h1 className="text-xl font-bold text-[#191C1E] tracking-tight">GEO / AI Search Readiness</h1>
          </div>
          <p className="text-xs text-[#434655] mt-0.5">
            Generative Engine Optimization assessment evaluating structure, factual density, and synthesis eligibility for LLM search engines.
          </p>
        </div>

        <div className="bg-white border border-[#D8DADD] px-3 py-1.5 rounded-sm flex items-center gap-2">
          <span className="text-xs text-[#434655]">GEO Score:</span>
          <span className="text-lg font-bold font-mono text-[#004AC6]">{geoAnalysis.score}/100</span>
        </div>
      </div>

      {/* Mandatory Explanatory Note from Spec */}
      <div className="p-3.5 bg-white border border-[#D8DADD] rounded-sm text-xs text-[#434655] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#004AC6] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-[#191C1E]">Methodology & Scope: </span>
          GEO readiness evaluates whether content is structured, clear, factual, entity-aware, and useful for AI-powered search experiences (such as Gemini Overviews, Perplexity, and ChatGPT Search). It evaluates empirical readability and extractability without claiming to predict proprietary closed-source ranking algorithms.
        </div>
      </div>

      {/* 6 Dimensions Breakdown */}
      <div className="space-y-3.5">
        <div className="text-[12px] font-bold uppercase tracking-wider text-[#434655] flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-[#004AC6]" />
          <span>6 Core Evaluated Dimensions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {geoAnalysis.dimensions.map((dim) => {
            const percentage = Math.round((dim.score / dim.maxScore) * 100);
            return (
              <div 
                key={dim.id}
                className="bg-white border border-[#D8DADD] rounded-sm p-4 space-y-2.5 hover:border-[#004AC6] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#191C1E]">{dim.name}</h3>
                  <div className="font-mono text-xs font-bold text-[#191C1E]">
                    {dim.score} / {dim.maxScore} pts
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="w-full h-1 bg-[#ECEEF0] mt-2">
                  <div 
                    className={`h-1 ${
                      percentage >= 75 ? 'bg-[#0D6832]' : percentage >= 55 ? 'bg-[#004AC6]' : 'bg-[#B26A00]'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Reason */}
                <p className="text-xs text-[#434655] leading-relaxed">
                  {dim.reason}
                </p>

                {/* Evidence */}
                <div className="bg-[#F8F9FC] border border-[#D8DADD] rounded-sm p-2 text-[11px] font-mono text-[#434655]">
                  <span className="font-semibold text-[#191C1E]">Evidence Anchor: </span>
                  {dim.evidence}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Findings & Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Key Observations */}
        <div className="bg-white border border-[#D8DADD] rounded-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[#D8DADD] bg-[#F2F4F6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#004AC6]" />
              <h2 className="text-[12px] font-bold uppercase text-[#434655]">
                Key Observed Signals
              </h2>
            </div>
          </div>

          <div className="p-4 space-y-2">
            {geoAnalysis.findings.map((f, idx) => (
              <div key={idx} className="p-2.5 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm text-xs text-[#191C1E] flex items-start gap-2">
                <span className="text-[#004AC6] font-bold">•</span>
                <span className="leading-relaxed">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Opportunities */}
        <div className="bg-white border border-[#D8DADD] rounded-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[#D8DADD] bg-[#F2F4F6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#0D6832]" />
              <h2 className="text-[12px] font-bold uppercase text-[#434655]">
                AI Search Optimization Opportunities
              </h2>
            </div>
          </div>

          <div className="p-4 space-y-2">
            {geoAnalysis.opportunities.map((opp, idx) => (
              <div key={idx} className="p-2.5 bg-[#EBF7EE]/40 border border-[#BDE7C8] rounded-sm text-xs text-[#191C1E] flex items-start gap-2">
                <span className="text-[#0D6832] font-bold">✓</span>
                <span className="leading-relaxed">{opp}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
