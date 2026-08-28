import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Check 
} from 'lucide-react';
import { EvaluationSummary } from '../types';

interface AiEvaluationViewProps {
  evaluation: EvaluationSummary;
}

export const AiEvaluationView: React.FC<AiEvaluationViewProps> = ({ evaluation }) => {
  return (
    <div className="flex flex-col gap-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D8DADD]">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#004AC6]" />
            <h1 className="text-xl font-bold text-[#191C1E] tracking-tight">AI Recommendation Quality Evaluation</h1>
          </div>
          <p className="text-xs text-[#434655] mt-0.5">
            Secondary evaluation gate verifying empirical evidence grounding, specificity, actionability, and absence of hallucinations.
          </p>
        </div>

        <div className="bg-white border border-[#D8DADD] px-3 py-1.5 rounded-sm flex items-center gap-2">
          <span className="text-xs text-[#434655]">Quality Score:</span>
          <span className="text-lg font-bold font-mono text-[#0D6832]">{evaluation.overallQualityScore}%</span>
        </div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-[#D8DADD] rounded-sm p-4">
          <div className="text-[11px] font-bold text-[#434655] uppercase tracking-wider mb-1">Evidence Supported</div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-light text-[#0D6832] font-mono">{evaluation.evidenceSupportedRate}%</span>
          </div>
          <div className="w-full bg-[#ECEEF0] h-1 mt-3">
            <div className="bg-[#0D6832] h-1" style={{ width: `${evaluation.evidenceSupportedRate}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-[#434655]">
            Traced directly to parsed DOM findings.
          </p>
        </div>

        <div className="bg-white border border-[#D8DADD] rounded-sm p-4">
          <div className="text-[11px] font-bold text-[#434655] uppercase tracking-wider mb-1">Actionability Rate</div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-light text-[#004AC6] font-mono">{evaluation.actionabilityRate}%</span>
          </div>
          <div className="w-full bg-[#ECEEF0] h-1 mt-3">
            <div className="bg-[#004AC6] h-1" style={{ width: `${evaluation.actionabilityRate}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-[#434655]">
            Imperative engineering guidance provided.
          </p>
        </div>

        <div className="bg-white border border-[#D8DADD] rounded-sm p-4">
          <div className="text-[11px] font-bold text-[#434655] uppercase tracking-wider mb-1">Specificity Rate</div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-light text-[#191C1E] font-mono">{evaluation.specificityRate}%</span>
          </div>
          <div className="w-full bg-[#ECEEF0] h-1 mt-3">
            <div className="bg-[#191C1E] h-1" style={{ width: `${evaluation.specificityRate}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-[#434655]">
            Concrete parameters & code snippets.
          </p>
        </div>

        <div className="bg-white border border-[#D8DADD] rounded-sm p-4">
          <div className="text-[11px] font-bold text-[#434655] uppercase tracking-wider mb-1">Duplicate Rate</div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-light text-[#0D6832] font-mono">{evaluation.duplicateRate}%</span>
          </div>
          <div className="w-full bg-[#ECEEF0] h-1 mt-3">
            <div className="bg-[#0D6832] h-1" style={{ width: `${100 - evaluation.duplicateRate}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-[#434655]">
            Redundant recommendation overlap.
          </p>
        </div>

      </div>

      {/* Evaluation Matrix Table */}
      <div className="bg-white border border-[#D8DADD] rounded-sm overflow-hidden">
        <div className="p-4 border-b border-[#D8DADD] bg-[#F2F4F6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#004AC6]" />
            <h2 className="text-[12px] font-bold uppercase text-[#434655]">
              Verification Matrix ({evaluation.evaluations.length} Directives)
            </h2>
          </div>
          <span className="text-[10px] text-[#434655] uppercase font-mono">
            Automated quality grading
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F9FC] border-b border-[#D8DADD]">
              <tr>
                <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase">Recommendation</th>
                <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase text-center">Evidence</th>
                <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase text-center">Actionable</th>
                <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase text-center">Specific</th>
                <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase text-center">Relevant</th>
                <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase">Confidence</th>
                <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase">Evaluator Verification</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-[#D8DADD]">
              {evaluation.evaluations.map((item) => (
                <tr key={item.recommendationId} className="hover:bg-[#F8F9FC] transition-colors">
                  <td className="px-4 py-3 font-semibold text-[#191C1E] max-w-[200px]">
                    {item.recommendationTitle}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {item.evidenceSupported ? (
                      <Check className="w-4 h-4 text-green-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-[#BA1A1A] mx-auto" />
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {item.actionable ? (
                      <Check className="w-4 h-4 text-green-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-[#BA1A1A] mx-auto" />
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {item.specific ? (
                      <Check className="w-4 h-4 text-green-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-[#BA1A1A] mx-auto" />
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {item.relevant ? (
                      <Check className="w-4 h-4 text-green-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-[#BA1A1A] mx-auto" />
                    )}
                  </td>

                  <td className="px-4 py-3 font-mono font-semibold text-[11px] text-[#191C1E]">
                    {Math.round(item.confidence * 100)}%
                  </td>

                  <td className="px-4 py-3">
                    <div className="text-xs text-[#191C1E]">{item.feedback}</div>
                    <div className="text-[11px] font-mono text-[#434655] bg-[#ECEEF0]/60 px-2 py-0.5 rounded-sm mt-1 border border-[#D8DADD] inline-block">
                      {item.evidenceVerification}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
