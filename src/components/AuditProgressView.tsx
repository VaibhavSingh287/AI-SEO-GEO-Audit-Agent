import React from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Circle, 
  XCircle, 
  Upload, 
  Building2,
  Cpu
} from 'lucide-react';
import { AuditStageInfo } from '../types';

interface AuditProgressViewProps {
  stages: AuditStageInfo[];
  overallProgress: number;
  error?: string;
  hint?: string;
  onRetryWithDemo: () => void;
  onGoToUpload: () => void;
}

export const AuditProgressView: React.FC<AuditProgressViewProps> = ({
  stages,
  overallProgress,
  error,
  hint,
  onRetryWithDemo,
  onGoToUpload
}) => {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 py-6">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#ECEEF0] text-[11px] font-mono font-semibold text-[#004AC6]">
          <Cpu className="w-3.5 h-3.5" />
          <span>ORCHESTRATOR ACTIVE</span>
        </div>
        <h1 className="text-xl font-bold text-[#191C1E] tracking-tight">
          {error ? 'Audit Process Interrupted' : 'Executing Staged AI SEO & GEO Analysis'}
        </h1>
        <p className="text-xs text-[#434655]">
          {error ? 'Network boundary encountered' : 'Processing document signals through deterministic validators and AI reasoning engines.'}
        </p>
      </div>

      {/* Progress Bar */}
      {!error && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono text-[#434655]">
            <span>Orchestration Progress</span>
            <span className="font-semibold text-[#191C1E]">{overallProgress}%</span>
          </div>
          <div className="w-full h-1 bg-[#ECEEF0]">
            <div 
              className="h-1 bg-[#004AC6] transition-all duration-300 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error / Fallback Box */}
      {error && (
        <div className="p-4 bg-white border border-[#BA1A1A]/30 rounded-sm space-y-3 shadow-xs">
          <div className="flex items-start gap-2.5">
            <XCircle className="w-5 h-5 text-[#BA1A1A] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-[#BA1A1A]">{error}</div>
              <p className="text-xs text-[#434655] mt-1">
                {hint || 'Browser security, CORS headers, or website bot protections may prevent direct analysis.'}
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-2 border-t border-[#D8DADD]">
            <button
              onClick={onGoToUpload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#004AC6] hover:bg-[#2563EB] text-white text-xs font-semibold rounded-sm shadow-xs transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload HTML File</span>
            </button>

            <button
              onClick={onRetryWithDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D8DADD] hover:bg-[#F2F4F6] text-[#191C1E] text-xs font-semibold rounded-sm transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-[#004AC6]" />
              <span>Use Demo Website</span>
            </button>
          </div>
        </div>
      )}

      {/* Stages List */}
      <div className="bg-white border border-[#D8DADD] rounded-sm divide-y divide-[#D8DADD]">
        {stages.map((stage, idx) => {
          let statusIcon = <Circle className="w-4 h-4 text-[#D8DADD]" />;
          let rowBg = 'bg-white';
          let textColor = 'text-[#434655]';

          if (stage.status === 'completed') {
            statusIcon = <CheckCircle2 className="w-4 h-4 text-green-600" />;
            textColor = 'text-[#191C1E]';
          } else if (stage.status === 'running') {
            statusIcon = <Loader2 className="w-4 h-4 text-[#004AC6] animate-spin" />;
            rowBg = 'bg-[#F8F9FC]';
            textColor = 'text-[#004AC6] font-semibold';
          } else if (stage.status === 'failed') {
            statusIcon = <XCircle className="w-4 h-4 text-[#BA1A1A]" />;
            textColor = 'text-[#BA1A1A] font-semibold';
          }

          return (
            <div 
              key={stage.id}
              className={`p-3.5 flex items-center justify-between transition-colors ${rowBg}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-[#434655]/60 w-4">
                  0{idx + 1}
                </span>
                <div className="flex items-center gap-2">
                  {statusIcon}
                  <span className={`text-xs ${textColor}`}>
                    {stage.label}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {stage.details && (
                  <span className="text-[11px] font-mono text-[#434655] hidden sm:inline max-w-xs truncate">
                    {stage.details}
                  </span>
                )}
                {stage.durationMs !== undefined && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-[#ECEEF0] text-[#434655]">
                    {stage.durationMs}ms
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
