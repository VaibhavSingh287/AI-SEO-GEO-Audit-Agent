import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  FileText, 
  Settings, 
  CheckCircle2, 
  FileSearch, 
  Cpu, 
  Network, 
  Sparkles, 
  ListChecks
} from 'lucide-react';
import { AuditReport, AppSettings } from '../types';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
  activeAudit: AuditReport | null;
  settings: AppSettings;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onNavigate,
  activeAudit,
  settings
}) => {
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new_audit', label: 'New Audit', icon: PlusCircle },
    { id: 'history', label: 'Audit History', icon: History },
    { id: 'report', label: 'Export Report', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const auditNavItems = [
    { id: 'audit_overview', label: 'Overview', icon: LayoutDashboard, score: activeAudit?.scores.overallSeo },
    { id: 'audit_technical', label: 'Technical SEO', icon: Cpu, score: activeAudit?.scores.technicalSeo, issues: activeAudit?.technicalSeo.issueCount },
    { id: 'audit_content', label: 'Content Analysis', icon: FileSearch, score: activeAudit?.scores.content },
    { id: 'audit_entity', label: 'Entity Map', icon: Network, score: activeAudit?.scores.entity },
    { id: 'audit_geo', label: 'GEO Readiness', icon: Sparkles, score: activeAudit?.scores.geoReadiness },
    { id: 'audit_recommendations', label: 'Recommendations', icon: ListChecks, badge: activeAudit?.recommendations.length },
    { id: 'audit_evaluation', label: 'AI Evaluation', icon: CheckCircle2, score: activeAudit?.evaluation.overallQualityScore },
  ];

  return (
    <aside className="w-full lg:w-[220px] bg-white border-b lg:border-b-0 lg:border-r border-[#D8DADD] shrink-0 flex flex-col justify-between select-none">
      <div>
        
        {/* Brand Section Header */}
        <div className="p-4 sm:p-5 border-b border-[#D8DADD]">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="text-left w-full focus:outline-none"
          >
            <div className="text-[#004AC6] font-bold tracking-tight text-base sm:text-lg leading-tight">
              AI SEO & GEO<br />Audit Agent
            </div>
            <div className="text-[10px] font-mono font-semibold text-[#434655] mt-1">
              HIGH DENSITY v2.4
            </div>
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="py-3">
          
          {/* Main Group */}
          <div className="px-4 mb-2 text-[10px] font-bold text-[#434655] uppercase tracking-widest">
            Main
          </div>
          <div className="space-y-0.5 mb-4">
            {mainNavItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-5 py-2 text-xs sm:text-sm transition-colors text-left ${
                    isActive
                      ? 'bg-[#F2F4F6] border-r-4 border-[#004AC6] text-[#004AC6] font-semibold'
                      : 'text-[#434655] hover:bg-[#F2F4F6] font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Analysis Group (Visible when active audit exists) */}
          {activeAudit && (
            <div>
              <div className="px-4 mb-2 text-[10px] font-bold text-[#434655] uppercase tracking-widest flex items-center justify-between">
                <span>Analysis</span>
                <span className="font-mono text-[9px] text-[#004AC6] font-bold">
                  {activeAudit.scores.overallSeo}/100
                </span>
              </div>
              <div className="space-y-0.5">
                {auditNavItems.map((item) => {
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`w-full flex items-center justify-between px-5 py-1.5 text-xs sm:text-sm transition-colors text-left ${
                        isActive
                          ? 'bg-[#F2F4F6] border-r-4 border-[#004AC6] text-[#004AC6] font-semibold'
                          : 'text-[#434655] hover:bg-[#F2F4F6] font-medium'
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                      
                      <div className="flex items-center gap-1">
                        {item.issues !== undefined && item.issues > 0 && (
                          <span className="text-[9px] font-bold px-1 py-0.2 rounded-sm bg-[#BA1A1A] text-white">
                            {item.issues}
                          </span>
                        )}
                        {item.score !== undefined && (
                          <span className="text-[10px] font-mono font-medium text-[#434655]">
                            {item.score}
                          </span>
                        )}
                        {item.badge !== undefined && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded-sm bg-[#ECEEF0] text-[#434655]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </nav>
      </div>

      {/* High Density Status Footer */}
      <div className="p-4 border-t border-[#D8DADD] bg-[#F2F4F6]">
        {activeAudit ? (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-[#434655] tracking-wider">AUDIT SOURCE</span>
              <span className={`px-1.5 py-0.5 text-white text-[9px] font-bold rounded-sm ${
                (activeAudit.sourceMode === 'LIVE_URL' || activeAudit.mode === 'live')
                  ? 'bg-[#0D6832]'
                  : (activeAudit.sourceMode === 'HTML_UPLOAD' || activeAudit.mode === 'upload')
                  ? 'bg-[#004AC6]'
                  : 'bg-[#2563EB]'
              }`}>
                {(activeAudit.sourceMode === 'LIVE_URL' || activeAudit.mode === 'live')
                  ? 'LIVE URL'
                  : (activeAudit.sourceMode === 'HTML_UPLOAD' || activeAudit.mode === 'upload')
                  ? 'HTML UPLOAD'
                  : 'DEMO'}
              </span>
            </div>
            <p className="text-[10px] text-[#434655] leading-tight truncate">
              {(activeAudit.sourceMode === 'LIVE_URL' || activeAudit.mode === 'live')
                ? (activeAudit.url || 'Real-time fetched document')
                : (activeAudit.sourceMode === 'HTML_UPLOAD' || activeAudit.mode === 'upload')
                ? 'Uploaded HTML document'
                : 'ApexCare sample dataset'}
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-[#434655] tracking-wider">SYSTEM MODE</span>
              <span className={`px-1.5 py-0.5 text-white text-[9px] font-bold rounded-sm ${
                settings.demoMode ? 'bg-[#2563EB]' : 'bg-[#0D6832]'
              }`}>
                {settings.demoMode ? 'DEMO' : 'LIVE READY'}
              </span>
            </div>
            <p className="text-[10px] text-[#434655] leading-tight">
              {settings.demoMode 
                ? 'Sample enterprise dataset ready for testing.'
                : 'Ready for live URL auditing.'}
            </p>
          </div>
        )}
      </div>

    </aside>
  );
};
