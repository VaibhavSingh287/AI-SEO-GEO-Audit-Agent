import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Download, 
  Copy, 
  PlusCircle 
} from 'lucide-react';
import { AuditReport } from '../types';
import { StorageService } from '../services/storage';

interface AuditHistoryViewProps {
  audits: AuditReport[];
  onSelectAudit: (audit: AuditReport, targetTab?: string) => void;
  onNavigate: (view: string) => void;
  onRefreshAudits: () => void;
}

export const AuditHistoryView: React.FC<AuditHistoryViewProps> = ({
  audits,
  onSelectAudit,
  onNavigate,
  onRefreshAudits
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState<'all' | 'demo' | 'live' | 'upload'>('all');

  const filteredAudits = audits.filter(a => {
    const matchesSearch = a.website.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = modeFilter === 'all' || a.mode === modeFilter || (a.sourceMode && a.sourceMode.toLowerCase().includes(modeFilter));
    return matchesSearch && matchesMode;
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this audit report from local storage?')) {
      StorageService.deleteAudit(id);
      onRefreshAudits();
    }
  };

  const handleDuplicate = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const cloned = StorageService.duplicateAudit(id);
    if (cloned) {
      onRefreshAudits();
    }
  };

  const handleExport = (e: React.MouseEvent, audit: AuditReport) => {
    e.stopPropagation();
    StorageService.exportAuditJson(audit);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D8DADD]">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#004AC6]" />
            <h1 className="text-xl font-bold text-[#191C1E] tracking-tight">Audit History Repository</h1>
          </div>
          <p className="text-xs text-[#434655] mt-0.5">
            Persisted audits stored securely in your browser's local sandbox storage.
          </p>
        </div>

        <button
          onClick={() => onNavigate('new_audit')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#004AC6] hover:bg-[#2563EB] text-white text-xs font-semibold rounded-sm shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Audit</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#D8DADD] rounded-sm p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#434655] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by website name or URL..."
            className="w-full pl-8 pr-3 py-1.5 border border-[#D8DADD] rounded-sm focus:outline-none focus:border-[#004AC6] text-xs font-mono"
          />
        </div>

        {/* Mode Filter */}
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-[#434655] mr-1">Mode:</span>
          {(['all', 'live', 'upload', 'demo'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setModeFilter(mode)}
              className={`px-2.5 py-1 rounded-sm font-semibold uppercase text-[11px] transition-colors ${
                modeFilter === mode
                  ? 'bg-[#004AC6] text-white'
                  : 'bg-[#ECEEF0] text-[#434655] hover:bg-[#D8DADD] hover:text-[#191C1E]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

      </div>

      {/* Audits Table */}
      <div className="bg-white border border-[#D8DADD] rounded-sm overflow-hidden">
        {filteredAudits.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#434655]">
            No audits found matching current search filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8F9FC] border-b border-[#D8DADD]">
                <tr>
                  <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase">Website Property</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase">Execution Date</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase">SEO Score</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase">GEO Score</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase">Issues</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase">Mode</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-[#434655] uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-[#D8DADD]">
                {filteredAudits.map((audit) => (
                  <tr
                    key={audit.id}
                    onClick={() => onSelectAudit(audit, 'audit_overview')}
                    className="hover:bg-[#F8F9FC] cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#191C1E] group-hover:text-[#004AC6] transition-colors">
                        {audit.website}
                      </div>
                      <div className="text-[11px] text-[#434655] truncate max-w-xs font-mono">
                        {audit.url}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-[#434655] font-mono text-[11px] whitespace-nowrap">
                      {new Date(audit.createdAt).toLocaleDateString()} {new Date(audit.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap font-mono">
                      <span className="font-bold text-[#191C1E]">
                        {audit.scores.overallSeo}
                      </span>
                      <span className="text-[#434655] text-[10px]"> / 100</span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap font-mono">
                      <span className="font-bold text-[#004AC6]">
                        {audit.scores.geoReadiness}
                      </span>
                      <span className="text-[#434655] text-[10px]"> / 100</span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {audit.technicalSeo.issueCount > 0 ? (
                        <span className="bg-[#BA1A1A] text-white px-1.5 py-0.5 text-[10px] font-bold rounded-sm font-mono">
                          {audit.technicalSeo.issueCount} ISSUES
                        </span>
                      ) : (
                        <span className="bg-green-600 text-white px-1.5 py-0.5 text-[10px] font-bold rounded-sm font-mono">
                          0 ISSUES
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${
                        (audit.sourceMode === 'LIVE_URL' || audit.mode === 'live')
                          ? 'bg-[#EBF7EE] text-[#0D6832] border-[#BDE7C8]'
                          : (audit.sourceMode === 'HTML_UPLOAD' || audit.mode === 'upload')
                          ? 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]'
                          : 'bg-[#F2F4F6] text-[#434655] border-[#D8DADD]'
                      }`}>
                        {(audit.sourceMode === 'LIVE_URL' || audit.mode === 'live') ? 'LIVE URL' : (audit.sourceMode === 'HTML_UPLOAD' || audit.mode === 'upload') ? 'HTML UPLOAD' : 'DEMO'}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAudit(audit, 'audit_overview');
                          }}
                          className="px-2 py-1 text-xs font-semibold rounded-sm bg-[#ECEEF0] hover:bg-[#D8DADD] text-[#191C1E] transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => handleDuplicate(e, audit.id)}
                          title="Duplicate Audit"
                          className="p-1 rounded-sm text-[#434655] hover:bg-[#ECEEF0] hover:text-[#191C1E]"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleExport(e, audit)}
                          title="Export JSON"
                          className="p-1 rounded-sm text-[#434655] hover:bg-[#ECEEF0] hover:text-[#191C1E]"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, audit.id)}
                          title="Delete Audit"
                          className="p-1 rounded-sm text-[#434655] hover:bg-[#BA1A1A]/10 hover:text-[#BA1A1A]"
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
      </div>

    </div>
  );
};
