import React from 'react';
import { 
  ShieldCheck, 
  Settings as SettingsIcon, 
  PlusCircle, 
  FileText,
  Info
} from 'lucide-react';
import { AuditReport, AppSettings } from '../types';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  settings: AppSettings;
  activeAudit?: AuditReport | null;
  activeAuditName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  settings,
  activeAudit,
  activeAuditName
}) => {
  const [showDemoTooltip, setShowDemoTooltip] = React.useState(false);
  const [serverStatus, setServerStatus] = React.useState<{ configured: boolean; model: string; provider: string } | null>(null);

  React.useEffect(() => {
    fetch('/api/gemini/status')
      .then(res => res.json())
      .then(data => setServerStatus(data))
      .catch(() => setServerStatus({ configured: false, model: 'gemini-3.6-flash', provider: 'offline_demo' }));
  }, [settings.aiProvider, settings.demoMode]);

  const isGeminiLive = !settings.demoMode && settings.aiProvider === 'gemini' && serverStatus?.configured;

  const isAuditView = currentView.startsWith('audit_') || currentView === 'report';
  const activeSourceMode = activeAudit?.sourceMode || (activeAudit?.mode === 'live' ? 'LIVE_URL' : activeAudit?.mode === 'upload' ? 'HTML_UPLOAD' : activeAudit ? 'DEMO' : undefined);

  return (
    <header className="h-14 bg-white border-b border-[#D8DADD] sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      
      {/* Breadcrumb / Title Area */}
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="text-[#434655] hover:text-[#191C1E] transition-colors font-medium flex items-center gap-1.5"
        >
          <span className="font-semibold">Audits</span>
        </button>
        <span className="text-[#D8DADD]">/</span>
        <span className="font-semibold text-[#191C1E] max-w-[200px] sm:max-w-xs truncate">
          {activeAuditName || (currentView === 'new_audit' ? 'New Audit Configuration' : currentView === 'history' ? 'Audit History' : currentView === 'settings' ? 'Settings' : 'Overview')}
        </span>
      </div>

      {/* Status Indicators & High Density Action Group */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Source Mode Pill for Active Audit */}
        {isAuditView && activeSourceMode && (
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] px-2.5 py-1 border rounded-sm font-mono font-semibold flex items-center gap-1.5 ${
              activeSourceMode === 'LIVE_URL'
                ? 'bg-[#EBF7EE] border-[#BDE7C8] text-[#0D6832]'
                : activeSourceMode === 'HTML_UPLOAD'
                ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8]'
                : 'bg-[#ECEEF0] border-[#D8DADD] text-[#434655]'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                activeSourceMode === 'LIVE_URL'
                  ? 'bg-[#146C2E]'
                  : activeSourceMode === 'HTML_UPLOAD'
                  ? 'bg-[#2563EB]'
                  : 'bg-[#64748B]'
              }`} />
              <span>SOURCE: {activeSourceMode}</span>
            </span>
          </div>
        )}

        {/* AI Engine Status Pill */}
        {activeAudit?.provider === 'gemini' || (isGeminiLive && (!activeAudit || activeAudit.mode !== 'demo')) ? (
          <div className="flex items-center gap-2 text-[11px] bg-[#EBF7EE] px-2.5 sm:px-3 py-1 border border-[#BDE7C8] rounded-sm font-mono">
            <span className="w-2 h-2 rounded-full bg-[#146C2E]" />
            <span className="text-[#0D6832] font-semibold">AI: GEMINI_ACTIVE</span>
          </div>
        ) : (!activeAudit && settings.demoMode) || (activeAudit?.sourceMode === 'DEMO' || activeAudit?.mode === 'demo') ? (
          <div className="relative">
            <div 
              onMouseEnter={() => setShowDemoTooltip(true)}
              onMouseLeave={() => setShowDemoTooltip(false)}
              onClick={() => setShowDemoTooltip(!showDemoTooltip)}
              className="flex items-center gap-2 text-[11px] bg-[#ECEEF0] px-2.5 sm:px-3 py-1 border border-[#D8DADD] rounded-sm font-mono cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              <span className="text-[#434655] font-semibold">API: DEMO_ACTIVE</span>
            </div>

            {showDemoTooltip && (
              <div className="absolute right-0 top-full mt-1.5 w-64 p-3 bg-[#191C1E] text-white text-[11px] rounded-sm shadow-md z-50 pointer-events-none">
                <p className="font-bold text-white mb-1">DEMO MODE ACTIVE</p>
                <p className="text-[#ECEEF0]/90 leading-tight">
                  Sample enterprise dataset loaded. Scoring and recommendation engines operate in fast offline simulation mode.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[11px] bg-[#F2F4F6] px-2.5 sm:px-3 py-1 border border-[#D8DADD] rounded-sm font-mono">
            <span className="w-2 h-2 rounded-full bg-[#004AC6]" />
            <span className="text-[#191C1E] font-semibold">AI: LOCAL_DETERMINISTIC</span>
          </div>
        )}

        {/* Quick Report CTA */}
        {activeAuditName && (
          <button
            onClick={() => onNavigate('report')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm border transition-colors ${
              currentView === 'report'
                ? 'bg-[#ECEEF0] border-[#004AC6] text-[#004AC6]'
                : 'bg-white border-[#D8DADD] text-[#434655] hover:bg-[#F2F4F6] hover:text-[#191C1E]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        )}

        {/* New Audit Action Button */}
        <button
          onClick={() => onNavigate('new_audit')}
          className="bg-[#004AC6] hover:bg-[#2563EB] text-white px-3.5 py-1.5 text-xs font-medium rounded-sm flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="font-semibold">New Audit</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => onNavigate('settings')}
          title="Application Settings"
          className={`p-1.5 rounded-sm border transition-colors ${
            currentView === 'settings'
              ? 'bg-[#ECEEF0] border-[#004AC6] text-[#004AC6]'
              : 'bg-white border-[#D8DADD] text-[#434655] hover:bg-[#F2F4F6] hover:text-[#191C1E]'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>

    </header>
  );
};
