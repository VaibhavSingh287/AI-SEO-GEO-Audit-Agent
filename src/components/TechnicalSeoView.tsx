import React, { useState } from 'react';
import { 
  Cpu, 
  Code, 
  Filter,
  Copy,
  Check
} from 'lucide-react';
import { TechnicalSeoResult } from '../types';

interface TechnicalSeoViewProps {
  technical: TechnicalSeoResult;
}

export const TechnicalSeoView: React.FC<TechnicalSeoViewProps> = ({ technical }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Indexability', 'On-Page', 'Structure', 'Links', 'Images', 'Structured Data', 'Social'];

  const filteredChecks = selectedCategory === 'All'
    ? technical.checks
    : technical.checks.filter(c => c.category === selectedCategory);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D8DADD]">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#004AC6]" />
            <h1 className="text-xl font-bold text-[#191C1E] tracking-tight">Technical SEO Analysis</h1>
          </div>
          <p className="text-xs text-[#434655] mt-0.5">
            Deterministic 100-point on-page validator inspecting crawling, indexability, metadata, structured data, and content markup.
          </p>
        </div>

        {/* Score Summary Metrics */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-[#D8DADD] px-3 py-1.5 rounded-sm flex items-center gap-2">
            <span className="text-xs text-[#434655]">Technical Score:</span>
            <span className="text-lg font-bold font-mono text-[#191C1E]">{technical.score}/100</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="px-2 py-1 rounded-sm bg-[#EBF7EE] text-[#0D6832]">
              {technical.passedCount} Pass
            </span>
            <span className="px-2 py-1 rounded-sm bg-[#FFF8E6] text-[#B26A00]">
              {technical.warningCount} Warning
            </span>
            <span className="px-2 py-1 rounded-sm bg-[#FDF2F2] text-[#BA1A1A]">
              {technical.issueCount} Issue
            </span>
          </div>
        </div>
      </div>

      {/* Summary Note & Score Component Breakdown */}
      <div className="p-3.5 bg-white border border-[#D8DADD] rounded-sm text-xs text-[#434655] leading-relaxed space-y-3">
        <div>
          <span className="font-semibold text-[#191C1E]">Audit Summary: </span>
          {technical.summary}
        </div>

        {/* 10-Component Score Matrix */}
        {technical.scoreBreakdown && (
          <div className="pt-2 border-t border-[#D8DADD]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#434655] mb-2">
              Score Component Breakdown (10 Deterministic Signals × 10 Pts Max)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-[11px]">
              <div className="p-1.5 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm">
                <span className="text-[#434655] block text-[9px] uppercase">Title Tag</span>
                <span className="font-bold text-[#191C1E]">{technical.scoreBreakdown.title}/10</span>
              </div>
              <div className="p-1.5 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm">
                <span className="text-[#434655] block text-[9px] uppercase">Meta Desc</span>
                <span className="font-bold text-[#191C1E]">{technical.scoreBreakdown.metaDescription}/10</span>
              </div>
              <div className="p-1.5 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm">
                <span className="text-[#434655] block text-[9px] uppercase">H1 Heading</span>
                <span className="font-bold text-[#191C1E]">{technical.scoreBreakdown.h1}/10</span>
              </div>
              <div className="p-1.5 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm">
                <span className="text-[#434655] block text-[9px] uppercase">Structure</span>
                <span className="font-bold text-[#191C1E]">{technical.scoreBreakdown.headingStructure}/10</span>
              </div>
              <div className="p-1.5 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm">
                <span className="text-[#434655] block text-[9px] uppercase">Canonical</span>
                <span className="font-bold text-[#191C1E]">{technical.scoreBreakdown.canonical}/10</span>
              </div>
              <div className="p-1.5 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm">
                <span className="text-[#434655] block text-[9px] uppercase">Robots Meta</span>
                <span className="font-bold text-[#191C1E]">{technical.scoreBreakdown.robots}/10</span>
              </div>
              <div className="p-1.5 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm">
                <span className="text-[#434655] block text-[9px] uppercase">Internal Links</span>
                <span className="font-bold text-[#191C1E]">{technical.scoreBreakdown.internalLinks}/10</span>
              </div>
              <div className="p-1.5 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm">
                <span className="text-[#434655] block text-[9px] uppercase">Images Alt</span>
                <span className="font-bold text-[#191C1E]">{technical.scoreBreakdown.imagesAlt}/10</span>
              </div>
              <div className="p-1.5 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm">
                <span className="text-[#434655] block text-[9px] uppercase">Structured Data</span>
                <span className="font-bold text-[#191C1E]">{technical.scoreBreakdown.structuredData}/10</span>
              </div>
              <div className="p-1.5 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm">
                <span className="text-[#434655] block text-[9px] uppercase">Open Graph</span>
                <span className="font-bold text-[#191C1E]">{technical.scoreBreakdown.openGraph}/10</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-[#434655] mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Category:</span>
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-sm whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-[#004AC6] text-white'
                : 'bg-white border border-[#D8DADD] text-[#434655] hover:bg-[#F2F4F6] hover:text-[#191C1E]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Checks Grid */}
      <div className="space-y-3">
        {filteredChecks.map((check) => {
          let statusBadge = (
            <span className="bg-green-600 text-white px-2 py-0.5 text-[10px] font-bold rounded-sm font-mono">
              PASS
            </span>
          );

          if (check.status === 'WARNING') {
            statusBadge = (
              <span className="bg-orange-500 text-white px-2 py-0.5 text-[10px] font-bold rounded-sm font-mono">
                WARNING
              </span>
            );
          } else if (check.status === 'ISSUE') {
            statusBadge = (
              <span className="bg-[#BA1A1A] text-white px-2 py-0.5 text-[10px] font-bold rounded-sm font-mono">
                ISSUE
              </span>
            );
          }

          return (
            <div 
              key={check.id}
              className="bg-white border border-[#D8DADD] rounded-sm p-4 space-y-2.5 hover:border-[#434655]/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {statusBadge}
                  <h3 className="text-xs font-bold text-[#191C1E]">{check.name}</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded-sm bg-[#ECEEF0] text-[#434655]">
                    {check.category}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-[#434655]">
                  Weight: {check.scoreAwarded}/{check.scoreWeight} pts
                </div>
              </div>

              {/* Finding */}
              <p className="text-xs text-[#191C1E] leading-relaxed">
                {check.finding}
              </p>

              {/* Observable Evidence */}
              <div className="bg-[#F8F9FC] border border-[#D8DADD] rounded-sm p-2.5 font-mono text-[11px] text-[#434655] space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#434655]/70">
                  Extracted Evidence Anchor:
                </div>
                <div className="text-[#191C1E] break-all select-all">
                  {check.evidence}
                </div>
              </div>

              {/* Recommended Fix if Issue or Warning */}
              {check.recommendedFix && (
                <div className="p-3 bg-[#EBF7EE]/40 border border-[#BDE7C8] rounded-sm text-xs text-[#191C1E] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0D6832] flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5" />
                      Recommended Fix:
                    </span>
                    <button
                      onClick={() => handleCopy(check.recommendedFix!, check.id)}
                      className="text-[11px] font-semibold text-[#004AC6] hover:underline flex items-center gap-1"
                    >
                      {copiedId === check.id ? (
                        <>
                          <Check className="w-3 h-3 text-[#0D6832]" />
                          <span className="text-[#0D6832]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy fix</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-[#434655] font-mono text-[11px] leading-relaxed break-all">
                    {check.recommendedFix}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
