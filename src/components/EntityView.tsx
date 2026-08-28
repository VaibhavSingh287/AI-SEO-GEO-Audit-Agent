import React from 'react';
import { 
  Network, 
  Building2, 
  Package, 
  MapPin, 
  Tag, 
  ArrowRight, 
  Layers 
} from 'lucide-react';
import { EntityAnalysisResult } from '../types';

interface EntityViewProps {
  entityAnalysis: EntityAnalysisResult;
}

export const EntityView: React.FC<EntityViewProps> = ({ entityAnalysis }) => {
  return (
    <div className="flex flex-col gap-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D8DADD]">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-[#004AC6]" />
            <h1 className="text-xl font-bold text-[#191C1E] tracking-tight">Entity & Knowledge Graph Analysis</h1>
          </div>
          <p className="text-xs text-[#434655] mt-0.5">
            Named entity extraction, Schema.org type disambiguation, and semantic relationship mapping for AI knowledge engines.
          </p>
        </div>

        <div className="bg-white border border-[#D8DADD] px-3 py-1.5 rounded-sm flex items-center gap-2">
          <span className="text-xs text-[#434655]">Entity Score:</span>
          <span className="text-lg font-bold font-mono text-[#191C1E]">{entityAnalysis.score}/100</span>
        </div>
      </div>

      {/* Summary Note */}
      <div className="p-3.5 bg-white border border-[#D8DADD] rounded-sm text-xs text-[#434655] leading-relaxed">
        <span className="font-semibold text-[#191C1E]">Knowledge Graph Summary: </span>
        {entityAnalysis.summary}
      </div>

      {/* Entities Table */}
      <div className="bg-white border border-[#D8DADD] rounded-sm overflow-hidden">
        <div className="p-4 border-b border-[#D8DADD] bg-[#F2F4F6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#004AC6]" />
            <h2 className="text-[12px] font-bold uppercase text-[#434655]">
              Extracted Named Entities ({entityAnalysis.entities.length})
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F9FC] border-b border-[#D8DADD]">
              <tr>
                <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase">Entity Name</th>
                <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase">Schema / Type</th>
                <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase">Confidence</th>
                <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase">Clarity</th>
                <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase">Description & Evidence</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-[#D8DADD]">
              {entityAnalysis.entities.map((ent) => (
                <tr key={ent.id} className="hover:bg-[#F8F9FC] transition-colors">
                  <td className="px-4 py-3 font-semibold text-[#191C1E] whitespace-nowrap">
                    {ent.entity}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[11px] font-mono font-medium bg-[#ECEEF0] text-[#191C1E] border border-[#D8DADD]">
                      {ent.type === 'Organization' && <Building2 className="w-3 h-3 text-[#004AC6]" />}
                      {ent.type === 'Product' && <Package className="w-3 h-3 text-[#0D6832]" />}
                      {ent.type === 'Location' && <MapPin className="w-3 h-3 text-[#BA1A1A]" />}
                      {ent.type === 'Category' && <Tag className="w-3 h-3 text-[#B26A00]" />}
                      <span>{ent.type}</span>
                    </span>
                  </td>

                  <td className="px-4 py-3 font-mono text-[11px] text-[#434655] whitespace-nowrap">
                    {Math.round(ent.confidence * 100)}%
                  </td>

                  <td className="px-4 py-3 font-mono text-[11px] text-[#434655] whitespace-nowrap">
                    {Math.round(ent.clarity * 100)}%
                  </td>

                  <td className="px-4 py-3">
                    <div className="text-xs text-[#191C1E]">{ent.description}</div>
                    <div className="text-[11px] font-mono text-[#434655] bg-[#ECEEF0]/60 px-2 py-0.5 rounded-sm mt-1 border border-[#D8DADD] inline-block">
                      <span className="font-semibold text-[#191C1E]">Anchor: </span>
                      {ent.evidence}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Entity Relationships Section */}
      <div className="bg-white border border-[#D8DADD] rounded-sm overflow-hidden">
        <div className="p-4 border-b border-[#D8DADD] bg-[#F2F4F6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-[#004AC6]" />
            <h2 className="text-[12px] font-bold uppercase text-[#434655]">
              Entity Relationship Graph ({entityAnalysis.relationships.length} Triples)
            </h2>
          </div>
          <span className="text-[10px] text-[#434655] uppercase font-mono">
            Semantic subject-predicate-object triples
          </span>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {entityAnalysis.relationships.length === 0 ? (
            <p className="text-xs text-[#434655]">No explicit relationship triples established.</p>
          ) : (
            entityAnalysis.relationships.map((rel, idx) => (
              <div 
                key={idx}
                className="p-3.5 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm flex items-center justify-between gap-3 text-xs"
              >
                <div className="font-bold text-[#191C1E] truncate max-w-[140px]" title={rel.source}>
                  {rel.source}
                </div>

                <div className="flex flex-col items-center px-2">
                  <span className="text-[10px] font-mono text-[#004AC6] font-semibold uppercase tracking-wider text-center">
                    {rel.relationship}
                  </span>
                  <div className="flex items-center w-full mt-0.5">
                    <div className="h-0.5 bg-[#004AC6] flex-1" />
                    <ArrowRight className="w-3.5 h-3.5 text-[#004AC6] -ml-1" />
                  </div>
                </div>

                <div className="font-bold text-[#191C1E] truncate max-w-[140px] text-right" title={rel.target}>
                  {rel.target}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
