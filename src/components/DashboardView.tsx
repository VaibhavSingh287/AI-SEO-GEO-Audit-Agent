import React from 'react';
import { 
  PlusCircle, 
  Trash2, 
  Download, 
  BarChart3,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { AuditReport } from '../types';
import { StorageService } from '../services/storage';

interface DashboardViewProps {
  audits: AuditReport[];
  onSelectAudit: (audit: AuditReport, targetTab?: string) => void;
  onNavigate: (view: string) => void;
  onRefreshAudits: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  audits,
  onSelectAudit,
  onNavigate,
  onRefreshAudits
}) => {
  const totalAudits = audits.length;
  const avgSeo = totalAudits > 0 
    ? Math.round(audits.reduce((acc, a) => acc + a.scores.overallSeo, 0) / totalAudits) 
    : 0;
  const avgGeo = totalAudits > 0 
    ? Math.round(audits.reduce((acc, a) => acc + a.scores.geoReadiness, 0) / totalAudits) 
    : 0;
  const totalIssues = audits.reduce((acc, a) => acc + a.technicalSeo.issueCount, 0);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this audit record from local storage?')) {
      StorageService.deleteAudit(id);
      onRefreshAudits();
    }
  };

  const handleExport = (e: React.MouseEvent, audit: AuditReport) => {
    e.stopPropagation();
    StorageService.exportAuditJson(audit);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* 4-Card High Density Metric Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Technical / Average SEO */}
        <div className="bg-white border border-[#D8DADD] p-4">
          <div className="text-[11px] text-[#434655] font-bold uppercase tracking-wider mb-1">
            Average SEO Health
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-light text-[#191C1E]">{avgSeo}</span>
            <span className="text-xs text-green-600 font-medium mb-1.5">Composite</span>
          </div>
          <div className="w-full bg-[#ECEEF0] h-1 mt-3">
            <div className="bg-[#004AC6] h-1" style={{ width: `${avgSeo}%` }} />
          </div>
        </div>

        {/* Average GEO Readiness */}
        <div className="bg-white border border-[#D8DADD] p-4">
          <div className="text-[11px] text-[#434655] font-bold uppercase tracking-wider mb-1">
            Average GEO Readiness
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-light text-[#004AC6] font-bold">{avgGeo}</span>
            <span className="text-xs text-green-600 font-medium mb-1.5">AI-Search</span>
          </div>
          <div className="w-full bg-[#ECEEF0] h-1 mt-3">
            <div className="bg-[#004AC6] h-1" style={{ width: `${avgGeo}%` }} />
          </div>
        </div>

        {/* Critical Issues Found */}
        <div className="bg-white border border-[#D8DADD] p-4">
          <div className="text-[11px] text-[#434655] font-bold uppercase tracking-wider mb-1">
            Critical Issues Found
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-light text-[#BA1A1A]">{totalIssues}</span>
            <span className="text-xs text-[#BA1A1A] font-medium mb-1.5">Blockers</span>
          </div>
          <div className="w-full bg-[#ECEEF0] h-1 mt-3">
            <div className="bg-[#BA1A1A] h-1" style={{ width: `${Math.min(totalIssues * 20, 100)}%` }} />
          </div>
        </div>

        {/* Stored Audits */}
        <div className="bg-white border border-[#D8DADD] p-4">
          <div className="text-[11px] text-[#434655] font-bold uppercase tracking-wider mb-1">
            Stored Audits
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-light text-[#191C1E]">{totalAudits}</span>
            <span className="text-xs text-[#434655] font-medium mb-1.5">Reports</span>
          </div>
          <div className="w-full bg-[#ECEEF0] h-1 mt-3">
            <div className="bg-[#434655] h-1 w-full" />
          </div>
        </div>

      </section>

      {/* Recent Audits Table Section */}
      <section className="bg-white border border-[#D8DADD] flex flex-col">
        <div className="p-4 border-b border-[#D8DADD] bg-[#F2F4F6] flex justify-between items-center">
          <h2 className="text-[12px] font-bold uppercase text-[#434655]">
            Recent Audit Reports ({audits.length})
          </h2>
          <button
            onClick={() => onNavigate('new_audit')}
            className="bg-[#004AC6] text-white px-3 py-1 text-xs font-semibold rounded-sm hover:bg-[#2563EB] transition-colors"
          >
            + Launch New Audit
          </button>
        </div>

        {audits.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-xs text-[#434655] mb-3">No audits stored in local history.</p>
            <button
              onClick={() => onNavigate('new_audit')}
              className="px-4 py-2 bg-[#004AC6] text-white text-xs font-semibold rounded-sm"
            >
              Start First Audit
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8F9FC] border-b border-[#D8DADD]">
                <tr>
                  <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase">Property / Website</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase">Date</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase">SEO Score</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase">GEO Score</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase">Issues</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase">Mode</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-[#D8DADD]">
                {audits.map((audit) => (
                  <tr
                    key={audit.id}
                    onClick={() => onSelectAudit(audit, 'audit_overview')}
                    className="hover:bg-[#F8F9FC] cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#191C1E]">{audit.website}</div>
                      <div className="text-[11px] text-[#434655] font-mono truncate max-w-xs">{audit.url}</div>
                    </td>

                    <td className="px-4 py-3 font-mono text-[11px] text-[#434655] whitespace-nowrap">
                      {new Date(audit.createdAt).toLocaleDateString()} {new Date(audit.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono font-bold text-xs text-[#191C1E]">
                        {audit.scores.overallSeo}/100
                      </span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono font-bold text-xs text-[#004AC6]">
                        {audit.scores.geoReadiness}/100
                      </span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {audit.technicalSeo.issueCount > 0 ? (
                        <span className="bg-[#BA1A1A] text-white px-2 py-0.5 text-[10px] font-bold rounded-sm">
                          {audit.technicalSeo.issueCount} CRITICAL
                        </span>
                      ) : (
                        <span className="text-[11px] text-green-600 font-semibold">0 ISSUES</span>
                      )}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="bg-[#ECEEF0] text-[#434655] px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-sm border border-[#D8DADD]">
                        {audit.mode}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAudit(audit, 'audit_overview');
                          }}
                          className="text-[#004AC6] text-[11px] font-semibold underline hover:text-[#2563EB]"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => handleExport(e, audit)}
                          title="Export JSON"
                          className="p-1 text-[#434655] hover:text-[#191C1E]"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, audit.id)}
                          title="Delete Audit"
                          className="p-1 text-[#434655] hover:text-[#BA1A1A]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* High Density Methodology Guarantee */}
      <div className="bg-white border border-[#D8DADD] p-4 text-xs text-[#434655]">
        <div className="font-bold text-[#191C1E] uppercase text-[11px] tracking-wider mb-1">
          B2B Precision & Methodology Architecture
        </div>
        <p className="leading-relaxed">
          The AI SEO & GEO Audit Agent computes technical SEO scores using deterministic on-page validators. Semantic search intent and entity relationships are mapped without inventing fictional score numbers. GEO (Generative Engine Optimization) readiness evaluates answer clarity, entity disambiguation, and structured factual density to assess visibility within AI retrieval systems.
        </p>
      </div>

    </div>
  );
};
