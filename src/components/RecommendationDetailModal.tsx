import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Code, 
  Copy, 
  Check, 
  ArrowRight
} from 'lucide-react';
import { Recommendation } from '../types';

interface RecommendationDetailModalProps {
  recommendation: Recommendation | null;
  onClose: () => void;
}

export const RecommendationDetailModal: React.FC<RecommendationDetailModalProps> = ({
  recommendation,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!recommendation) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  let badgeClass = 'bg-gray-400 text-white px-2 py-0.5 text-[10px] font-bold rounded-sm';
  let label = 'LOW';

  if (recommendation.priority === 'P0' || recommendation.impact === 'High') {
    badgeClass = 'bg-[#BA1A1A] text-white px-2 py-0.5 text-[10px] font-bold rounded-sm';
    label = 'CRITICAL';
  } else if (recommendation.priority === 'P1') {
    badgeClass = 'bg-orange-500 text-white px-2 py-0.5 text-[10px] font-bold rounded-sm';
    label = 'HIGH';
  } else if (recommendation.priority === 'P2') {
    badgeClass = 'bg-blue-500 text-white px-2 py-0.5 text-[10px] font-bold rounded-sm';
    label = 'MEDIUM';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191C1E]/60 backdrop-blur-xs">
      <div 
        className="bg-white border border-[#D8DADD] rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#D8DADD] bg-[#F2F4F6] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className={badgeClass}>
              {recommendation.priority} • {label}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#ECEEF0] text-[#434655]">
              {recommendation.area}
            </span>
            <span className="text-xs font-mono text-[#434655]">
              Confidence: {Math.round(recommendation.confidence * 100)}%
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-sm text-[#434655] hover:bg-[#ECEEF0] hover:text-[#191C1E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          
          {/* Title & Description */}
          <div>
            <h2 className="text-base font-bold text-[#191C1E]">
              {recommendation.title}
            </h2>
            <p className="text-xs text-[#434655] mt-1 leading-relaxed">
              {recommendation.description}
            </p>
          </div>

          {/* Effort & Impact Matrix */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm">
              <div className="text-[10px] font-semibold uppercase text-[#434655]">Expected Impact</div>
              <div className="font-bold text-[#191C1E] mt-0.5">{recommendation.impact} Impact</div>
            </div>

            <div className="p-3 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm">
              <div className="text-[10px] font-semibold uppercase text-[#434655]">Implementation Effort</div>
              <div className="font-bold text-[#191C1E] mt-0.5">{recommendation.effort} Effort</div>
            </div>
          </div>

          {/* Observable Evidence Anchors */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#191C1E] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#004AC6]" />
              <span>Observable Evidence Chain</span>
            </div>

            <div className="space-y-2">
              {recommendation.evidenceDetails.map((evidence, idx) => (
                <div 
                  key={idx}
                  className="bg-[#F8F9FC] border border-[#D8DADD] rounded-sm p-3 text-xs font-mono text-[#191C1E] break-all leading-relaxed"
                >
                  <div className="text-[10px] uppercase font-bold text-[#434655]/70 mb-0.5">
                    Signal Anchor #{idx + 1}
                  </div>
                  {evidence}
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Action */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#0D6832] flex items-center gap-1.5">
              <ArrowRight className="w-4 h-4" />
              <span>Recommended Action</span>
            </div>
            <div className="p-3 bg-[#EBF7EE]/40 border border-[#BDE7C8] rounded-sm text-xs text-[#191C1E] leading-relaxed">
              {recommendation.recommendedAction}
            </div>
          </div>

          {/* Code Snippet if present */}
          {recommendation.codeSnippet && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-wider text-[#191C1E] flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-[#004AC6]" />
                  <span>Code / Markup Implementation</span>
                </div>

                <button
                  onClick={() => handleCopy(recommendation.codeSnippet!)}
                  className="text-xs font-semibold text-[#004AC6] hover:underline flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#0D6832]" />
                      <span className="text-[#0D6832]">Copied snippet</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy snippet</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-[#191C1E] text-[#ECEEF0] p-3.5 rounded-sm font-mono text-[11px] overflow-x-auto leading-relaxed">
                <pre>{recommendation.codeSnippet}</pre>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#D8DADD] bg-[#F2F4F6] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#ECEEF0] hover:bg-[#D8DADD] text-[#191C1E] text-xs font-semibold rounded-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
