import React, { useEffect, useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Key, 
  RefreshCw, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onResetDemo: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetDemo
}) => {
  const [serverStatus, setServerStatus] = useState<{ configured: boolean; model: string } | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    fetch('/api/gemini/status')
      .then(res => res.json())
      .then(data => {
        setServerStatus({
          configured: Boolean(data.configured),
          model: data.model || 'gemini-3.6-flash'
        });
        setLoadingStatus(false);
      })
      .catch(() => {
        setServerStatus({ configured: false, model: 'gemini-3.6-flash' });
        setLoadingStatus(false);
      });
  }, []);

  const handleToggle = (key: keyof AppSettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    onUpdateSettings(updated);
  };

  const handleProviderChange = (provider: 'gemini' | 'offline_demo') => {
    const updated = { ...settings, aiProvider: provider };
    onUpdateSettings(updated);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      
      {/* View Header */}
      <div className="pb-4 border-b border-[#D8DADD]">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#004AC6]" />
          <h1 className="text-xl font-bold text-[#191C1E] tracking-tight">Platform Configuration</h1>
        </div>
        <p className="text-xs text-[#434655] mt-0.5">
          Manage AI providers, execution mode, evidence generation parameters, and local data persistence.
        </p>
      </div>

      {/* Execution Mode & Engine */}
      <div className="bg-white border border-[#D8DADD] rounded-sm overflow-hidden">
        <div className="p-4 border-b border-[#D8DADD] bg-[#F2F4F6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#004AC6]" />
            <h2 className="text-[12px] font-bold uppercase text-[#434655]">
              Engine Execution Mode
            </h2>
          </div>
        </div>

        <div className="p-4 space-y-4 text-xs">
          {/* Demo Mode Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-[#191C1E]">Demo Mode</div>
              <p className="text-[#434655] text-[11px] mt-0.5">
                Forces fast offline deterministic execution using realistic fictional portfolio sample data.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleToggle('demoMode')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.demoMode ? 'bg-[#004AC6]' : 'bg-[#ECEEF0]'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.demoMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* AI Provider Selection */}
          <div className="pt-3 border-t border-[#D8DADD] space-y-2">
            <label className="font-semibold text-[#191C1E] block">
              Active AI Reasoning Engine
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleProviderChange('gemini')}
                className={`p-3 rounded-sm border text-left transition-colors ${
                  settings.aiProvider === 'gemini'
                    ? 'border-[#004AC6] bg-[#004AC6]/5'
                    : 'border-[#D8DADD] bg-white hover:bg-[#F8F9FC]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#191C1E]">Google Gemini 3.6 Flash</span>
                  <Sparkles className="w-4 h-4 text-[#004AC6]" />
                </div>
                <p className="text-[11px] text-[#434655] mt-1">
                  Server-side LLM inference for nuanced search intent classification and structured reasoning.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleProviderChange('offline_demo')}
                className={`p-3 rounded-sm border text-left transition-colors ${
                  settings.aiProvider === 'offline_demo'
                    ? 'border-[#004AC6] bg-[#004AC6]/5'
                    : 'border-[#D8DADD] bg-white hover:bg-[#F8F9FC]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#191C1E]">Deterministic Offline Engine</span>
                  <ShieldCheck className="w-4 h-4 text-[#0D6832]" />
                </div>
                <p className="text-[11px] text-[#434655] mt-1">
                  100% zero-cloud-cost local algorithm matching official B2B evaluation benchmarks.
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Server API Key & Connectivity Status */}
      <div className="bg-white border border-[#D8DADD] rounded-sm p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-[#004AC6]" />
          <h2 className="text-[12px] font-bold uppercase text-[#434655]">
            Backend API Credentials
          </h2>
        </div>

        <div className="p-3 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm flex items-center justify-between text-xs">
          <div>
            <div className="font-semibold text-[#191C1E] flex items-center gap-1.5">
              <span>Environment Status:</span>
              {loadingStatus ? (
                <span className="text-[#434655]">Checking server...</span>
              ) : serverStatus?.configured ? (
                <span className="text-[#0D6832] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Connected via Server Environment (GEMINI_API_KEY)
                </span>
              ) : (
                <span className="text-[#B26A00] font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Not configured (Deterministic offline mode active)
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#434655] mt-0.5">
              API secrets are securely managed on the backend server and never exposed to the client browser.
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Quality & Pipeline Controls */}
      <div className="bg-white border border-[#D8DADD] rounded-sm p-4 space-y-3 text-xs">
        <div className="text-[12px] font-bold uppercase text-[#434655]">
          Analysis & Evidence Generation
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-[#191C1E]">Include Empirical Evidence Anchors</div>
              <p className="text-[#434655] text-[11px]">
                Enforces linking every recommendation to observable DOM findings.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('includeEvidence')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.includeEvidence ? 'bg-[#004AC6]' : 'bg-[#ECEEF0]'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.includeEvidence ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#D8DADD]">
            <div>
              <div className="font-semibold text-[#191C1E]">Secondary Recommendation Evaluation Gate</div>
              <p className="text-[#434655] text-[11px]">
                Runs secondary validation checks for specificity, actionability, and hallucination prevention.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('includeAiEvaluation')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.includeAiEvaluation ? 'bg-[#004AC6]' : 'bg-[#ECEEF0]'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.includeAiEvaluation ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Local Storage Reset */}
      <div className="bg-white border border-[#D8DADD] rounded-sm p-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-[#191C1E]">Reset Local Storage Repository</div>
          <p className="text-[11px] text-[#434655] mt-0.5">
            Clears cached audit reports and restores the default ApexCare Health Insurance benchmark demo.
          </p>
        </div>

        <button
          onClick={onResetDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D8DADD] hover:bg-[#F2F4F6] text-[#BA1A1A] text-xs font-semibold rounded-sm transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset to Demo Data</span>
        </button>
      </div>

    </div>
  );
};
