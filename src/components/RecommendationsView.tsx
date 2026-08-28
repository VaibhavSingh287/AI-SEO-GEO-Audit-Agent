import React, { useState } from 'react';
import { 
  ListChecks, 
  ShieldCheck, 
  Code,
  ArrowRight
} from 'lucide-react';
import { Recommendation } from '../types';
import { RecommendationDetailModal } from './RecommendationDetailModal';

interface RecommendationsViewProps {
  recommendations: Recommendation[];
  initialSelectedId?: string | null;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  recommendations,
  initialSelectedId
}) => {
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [activeModalRec, setActiveModalRec] = useState<Recommendation | null>(
    initialSelectedId ? (recommendations.find(r => r.id === initialSelectedId) || null) : null
  );

  const areas = ['All', 'Technical', 'Content', 'Entity', 'GEO'];
  const priorities = ['All', 'P0', 'P1', 'P2', 'P3'];

  const filteredRecs = recommendations.filter(r => {
    if (selectedArea !== 'All' && r.area !== selectedArea) return false;
    if (selectedPriority !== 'All' && r.priority !== selectedPriority) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D8DADD]">
        <div>
          <div className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-[#004AC6]" />
            <h1 className="text-xl font-bold text-[#191C1E] tracking-tight">Audit Recommendations</h1>
          </div>
          <p className="text-xs text-[#434655] mt-0.5">
            Evidence-backed actionable directives prioritized by search engine visibility and generative AI citation impact.
          </p>
        </div>

        <div className="bg-white border border-[#D8DADD] px-3 py-1.5 rounded-sm flex items-center gap-2">
          <span className="text-xs text-[#434655]">Total Recommendations:</span>
          <span className="text-lg font-bold font-mono text-[#191C1E]">{recommendations.length}</span>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white border border-[#D8DADD] rounded-sm p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Area Filter */}
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-[#434655] mr-1">Area:</span>
          {areas.map(area => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-2.5 py-1 rounded-sm font-semibold transition-colors ${
                selectedArea === area
                  ? 'bg-[#004AC6] text-white'
                  : 'bg-[#ECEEF0] text-[#434655] hover:bg-[#D8DADD] hover:text-[#191C1E]'
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-[#434655] mr-1">Priority:</span>
          {priorities.map(p => (
            <button
              key={p}
              onClick={() => setSelectedPriority(p)}
              className={`px-2.5 py-1 rounded-sm font-semibold font-mono transition-colors ${
                selectedPriority === p
                  ? 'bg-[#191C1E] text-white'
                  : 'bg-[#ECEEF0] text-[#434655] hover:bg-[#D8DADD] hover:text-[#191C1E]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

      </div>

      {/* Recommendations Cards List */}
      <div className="space-y-3.5">
        {filteredRecs.length === 0 ? (
          <div className="bg-white border border-[#D8DADD] rounded-sm p-8 text-center text-xs text-[#434655]">
            No recommendations match the selected filters.
          </div>
        ) : (
          filteredRecs.map((rec) => {
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
              <div 
                key={rec.id}
                className="bg-white border border-[#D8DADD] rounded-sm p-4 space-y-3 hover:border-[#434655]/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={badgeClass}>
                        {rec.priority} • {label}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-[#ECEEF0] text-[#434655]">
                        {rec.area}
                      </span>
                      {rec.sourceMode && (
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                          rec.sourceMode === 'LIVE_URL' 
                            ? 'bg-[#EBF7EE] text-[#0D6832] border border-[#BDE7C8]' 
                            : rec.sourceMode === 'HTML_UPLOAD'
                            ? 'bg-[#E8F0FE] text-[#004AC6] border border-[#AECBFA]'
                            : 'bg-[#F1F3F4] text-[#434655]'
                        }`}>
                          {rec.sourceMode === 'LIVE_URL' ? 'LIVE FINDING' : rec.sourceMode === 'HTML_UPLOAD' ? 'UPLOAD FINDING' : 'DEMO SAMPLE'}
                        </span>
                      )}
                      <h3 className="text-xs font-bold text-[#191C1E]">
                        {rec.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[#434655] leading-relaxed">
                      {rec.description}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveModalRec(rec)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-sm bg-[#ECEEF0] hover:bg-[#D8DADD] text-[#191C1E] whitespace-nowrap self-start mt-2 sm:mt-0 transition-colors flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#004AC6]" />
                    <span>View Evidence & Fix</span>
                  </button>
                </div>

                {/* Observable Evidence preview */}
                {rec.evidenceDetails.length > 0 && (
                  <div className="bg-[#F8F9FC] border border-[#D8DADD] rounded-sm p-2.5 text-[11px] font-mono text-[#434655]">
                    <span className="font-semibold text-[#191C1E]">Observable Anchor: </span>
                    {rec.evidenceDetails[0]}
                  </div>
                )}

                {/* Action Preview */}
                <div className="p-2.5 bg-[#EBF7EE]/40 border border-[#BDE7C8] rounded-sm text-xs text-[#191C1E] flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-[#0D6832] shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{rec.recommendedAction}</span>
                </div>

                {/* Metrics footer */}
                <div className="flex items-center gap-4 text-[11px] font-mono text-[#434655] pt-1">
                  <span>Impact: <strong className="text-[#191C1E]">{rec.impact}</strong></span>
                  <span>•</span>
                  <span>Effort: <strong className="text-[#191C1E]">{rec.effort}</strong></span>
                  <span>•</span>
                  <span>Confidence: <strong className="text-[#191C1E]">{Math.round(rec.confidence * 100)}%</strong></span>
                  {rec.codeSnippet && (
                    <>
                      <span>•</span>
                      <span className="text-[#004AC6] font-semibold flex items-center gap-1">
                        <Code className="w-3 h-3" /> Code Snippet Available
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Evidence & Snippet Modal */}
      <RecommendationDetailModal
        recommendation={activeModalRec}
        onClose={() => setActiveModalRec(null)}
      />

    </div>
  );
};
