import React from 'react';
import { 
  FileSearch, 
  Target, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle2, 
  Lightbulb
} from 'lucide-react';
import { ContentAnalysisResult } from '../types';

interface ContentViewProps {
  content: ContentAnalysisResult;
}

export const ContentView: React.FC<ContentViewProps> = ({ content }) => {
  return (
    <div className="flex flex-col gap-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D8DADD]">
        <div>
          <div className="flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-[#004AC6]" />
            <h1 className="text-xl font-bold text-[#191C1E] tracking-tight">Content & Search Intent Analysis</h1>
          </div>
          <p className="text-xs text-[#434655] mt-0.5">
            Semantic topic structure, query intent classification, conversational questions, and informational completeness.
          </p>
        </div>

        <div className="bg-white border border-[#D8DADD] px-3 py-1.5 rounded-sm flex items-center gap-2">
          <span className="text-xs text-[#434655]">Content Score:</span>
          <span className="text-lg font-bold font-mono text-[#191C1E]">{content.overallContentScore}/100</span>
        </div>
      </div>

      {/* Primary Search Intent Classification Card */}
      <div className="bg-white border border-[#D8DADD] rounded-sm p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#004AC6]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#191C1E]">
              Classified Search Intent
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-sm bg-[#004AC6] text-white font-semibold text-xs">
              {content.likelySearchIntent}
            </span>
            <span className="text-[11px] font-mono text-[#434655] bg-[#ECEEF0] px-2 py-0.5 rounded-sm">
              {Math.round(content.intentConfidence * 100)}% Confidence
            </span>
          </div>
        </div>

        <div className="p-3 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm text-xs text-[#191C1E] leading-relaxed">
          <span className="font-semibold text-[#004AC6]">Classification Logic: </span>
          {content.intentReason}
        </div>

        <div className="text-xs text-[#434655] flex items-center gap-2">
          <span className="font-semibold text-[#191C1E]">Primary Topic Anchor:</span>
          <span className="font-mono text-[#191C1E] bg-[#ECEEF0] px-2 py-0.5 rounded-sm">
            {content.primaryTopic}
          </span>
        </div>
      </div>

      {/* Content Coverage Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white border border-[#D8DADD] rounded-sm p-3.5">
          <div className="text-[11px] font-semibold text-[#434655] uppercase tracking-wider">Topic Coverage</div>
          <div className="mt-2 text-2xl font-light font-mono text-[#191C1E]">
            {content.topicCoverageScore}
          </div>
          <div className="w-full bg-[#ECEEF0] h-1 mt-2">
            <div className="bg-[#004AC6] h-1" style={{ width: `${content.topicCoverageScore}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-[#434655]">
            Semantic depth across core and secondary keyword clusters.
          </p>
        </div>

        <div className="bg-white border border-[#D8DADD] rounded-sm p-3.5">
          <div className="text-[11px] font-semibold text-[#434655] uppercase tracking-wider">Question Coverage</div>
          <div className="mt-2 text-2xl font-light font-mono text-[#191C1E]">
            {content.questionCoverageScore}
          </div>
          <div className="w-full bg-[#ECEEF0] h-1 mt-2">
            <div className="bg-[#004AC6] h-1" style={{ width: `${content.questionCoverageScore}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-[#434655]">
            Presence of direct natural-language query resolutions.
          </p>
        </div>

        <div className="bg-white border border-[#D8DADD] rounded-sm p-3.5">
          <div className="text-[11px] font-semibold text-[#434655] uppercase tracking-wider">Structure & Chunking</div>
          <div className="mt-2 text-2xl font-light font-mono text-[#191C1E]">
            {content.structureScore}
          </div>
          <div className="w-full bg-[#ECEEF0] h-1 mt-2">
            <div className="bg-[#004AC6] h-1" style={{ width: `${content.structureScore}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-[#434655]">
            Heading hierarchy suitability for AI retrieval chunking.
          </p>
        </div>
      </div>

      {/* Detected Questions & Content Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Detected Questions */}
        <div className="bg-white border border-[#D8DADD] rounded-sm overflow-hidden">
          <div className="p-4 border-b border-[#D8DADD] bg-[#F2F4F6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#004AC6]" />
              <h2 className="text-[12px] font-bold uppercase text-[#434655]">
                Extracted Questions ({content.detectedQuestions.length})
              </h2>
            </div>
          </div>

          <div className="p-4 space-y-2">
            {content.detectedQuestions.length === 0 ? (
              <p className="text-xs text-[#434655]">No explicit questions detected in heading tags or FAQ blocks.</p>
            ) : (
              content.detectedQuestions.map((q, idx) => (
                <div key={idx} className="p-2 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm text-xs text-[#191C1E] flex items-start gap-2">
                  <span className="text-[#004AC6] font-bold font-mono">Q{idx + 1}:</span>
                  <span>{q}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Content Gaps */}
        <div className="bg-white border border-[#D8DADD] rounded-sm overflow-hidden">
          <div className="p-4 border-b border-[#D8DADD] bg-[#F2F4F6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#BA1A1A]" />
              <h2 className="text-[12px] font-bold uppercase text-[#434655]">
                Identified Content Gaps ({content.contentGaps.length})
              </h2>
            </div>
          </div>

          <div className="p-4 space-y-2">
            {content.contentGaps.map((gap, idx) => (
              <div key={idx} className="p-2.5 bg-[#FFF8E6]/50 border border-[#FFE08A] rounded-sm text-xs text-[#191C1E] flex items-start gap-2">
                <span className="text-[#B26A00] font-bold">•</span>
                <span className="leading-relaxed">{gap}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recommended Improvements */}
      <div className="bg-white border border-[#D8DADD] rounded-sm overflow-hidden">
        <div className="p-4 border-b border-[#D8DADD] bg-[#F2F4F6] flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#0D6832]" />
          <h2 className="text-[12px] font-bold uppercase text-[#434655]">
            Recommended Content Optimizations
          </h2>
        </div>

        <div className="p-4 space-y-2.5">
          {content.recommendedImprovements.map((imp, idx) => (
            <div key={idx} className="p-3 bg-[#EBF7EE]/40 border border-[#BDE7C8] rounded-sm text-xs text-[#191C1E] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#0D6832] shrink-0 mt-0.5" />
              <span className="leading-relaxed">{imp}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
