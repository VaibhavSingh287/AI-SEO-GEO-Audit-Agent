import React, { useState, useRef } from 'react';
import { 
  Globe, 
  Upload, 
  CheckSquare, 
  Square, 
  ArrowRight, 
  FileCode, 
  AlertCircle,
  Building2
} from 'lucide-react';
import { AuditConfiguration, AppSettings } from '../types';

interface NewAuditViewProps {
  onStartAudit: (
    input: { type: 'url' | 'html' | 'demo'; value?: string; url?: string },
    config: AuditConfiguration
  ) => void;
  settings: AppSettings;
}

export const NewAuditView: React.FC<NewAuditViewProps> = ({
  onStartAudit,
  settings
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'upload' | 'demo'>('url');
  const [urlInput, setUrlInput] = useState('https://example.com');
  const [htmlContent, setHtmlContent] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedUrlLabel, setUploadedUrlLabel] = useState('https://uploaded-site.local');
  const [errorMsg, setErrorMsg] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configuration options (All enabled by default)
  const [config, setConfig] = useState<AuditConfiguration>({
    runTechnical: true,
    runContent: true,
    runEntity: true,
    runGeo: true,
    runEvaluation: true
  });

  const toggleConfig = (key: keyof AuditConfiguration) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.html') && !file.name.endsWith('.htm') && file.type !== 'text/html') {
      setErrorMsg('Please select a valid .html or .htm document.');
      return;
    }

    setErrorMsg('');
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setHtmlContent(content || '');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.html') && !file.name.endsWith('.htm') && file.type !== 'text/html') {
      setErrorMsg('Please drop a valid .html file.');
      return;
    }

    setErrorMsg('');
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setHtmlContent(content || '');
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (activeTab === 'url') {
      if (!urlInput.trim()) {
        setErrorMsg('Please enter a target website URL to audit.');
        return;
      }
      onStartAudit({ type: 'url', value: urlInput.trim() }, config);
    } else if (activeTab === 'upload') {
      if (!htmlContent.trim()) {
        setErrorMsg('Please upload or drag & drop an HTML document.');
        return;
      }
      onStartAudit({ 
        type: 'html', 
        value: htmlContent, 
        url: uploadedUrlLabel || 'https://uploaded-site.local' 
      }, config);
    } else if (activeTab === 'demo') {
      onStartAudit({ type: 'demo' }, config);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      
      {/* Title */}
      <div className="pb-4 border-b border-[#D8DADD]">
        <h1 className="text-xl font-bold text-[#191C1E] tracking-tight">Configure New SEO & GEO Audit</h1>
        <p className="text-xs text-[#434655] mt-0.5">
          Execute staged technical SEO extraction, semantic search intent classification, and 6-dimension generative AI readiness diagnostics.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-[#BA1A1A]/10 border border-[#BA1A1A]/20 rounded-sm text-xs text-[#BA1A1A] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Input Selection Tabs */}
      <div className="bg-white border border-[#D8DADD] rounded-sm overflow-hidden">
        <div className="flex border-b border-[#D8DADD] bg-[#F8F9FC]">
          <button
            type="button"
            onClick={() => { setActiveTab('url'); setErrorMsg(''); }}
            className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 border-r border-[#D8DADD] transition-colors ${
              activeTab === 'url'
                ? 'bg-white text-[#004AC6] border-b-2 border-b-[#004AC6]'
                : 'text-[#434655] hover:text-[#191C1E]'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Website URL</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('upload'); setErrorMsg(''); }}
            className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 border-r border-[#D8DADD] transition-colors ${
              activeTab === 'upload'
                ? 'bg-white text-[#004AC6] border-b-2 border-b-[#004AC6]'
                : 'text-[#434655] hover:text-[#191C1E]'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload HTML</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('demo'); setErrorMsg(''); }}
            className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'demo'
                ? 'bg-white text-[#004AC6] border-b-2 border-b-[#004AC6]'
                : 'text-[#434655] hover:text-[#191C1E]'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#004AC6]" />
            <span>Use Demo Website</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          
          {/* TAB 1: URL Input */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#191C1E]">
                Target Website URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#434655]">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#D8DADD] rounded-sm focus:outline-none focus:border-[#004AC6] font-mono"
                />
              </div>
              <div className="p-3 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm text-[11px] text-[#434655] space-y-1">
                <p className="font-semibold text-[#191C1E]">URL Fetch Proxy Notice:</p>
                <p>
                  Direct browser crawling may encounter CORS, server anti-bot protections, or single-page app JS rendering. If live URL fetch fails, you can seamlessly upload raw HTML or use the offline demo dataset.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Upload HTML */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#191C1E] mb-1">
                  Synthetic Target Domain Label (Optional)
                </label>
                <input
                  type="text"
                  value={uploadedUrlLabel}
                  onChange={(e) => setUploadedUrlLabel(e.target.value)}
                  placeholder="https://mycompany.com/landing-page"
                  className="w-full px-3 py-1.5 text-xs border border-[#D8DADD] rounded-sm focus:outline-none focus:border-[#004AC6] font-mono"
                />
              </div>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#D8DADD] hover:border-[#004AC6] rounded-sm p-6 text-center cursor-pointer bg-[#F8F9FC] transition-colors"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".html,.htm,text/html"
                  className="hidden"
                />
                <FileCode className="w-8 h-8 text-[#004AC6] mx-auto mb-2" />
                <div className="text-xs font-semibold text-[#191C1E]">
                  {uploadedFileName ? `Selected: ${uploadedFileName}` : 'Click to select or drag and drop HTML file'}
                </div>
                <p className="text-[11px] text-[#434655] mt-1">
                  Accepts standard export HTML from WordPress, Webflow, Shopify, or raw page source
                </p>
                {htmlContent && (
                  <span className="inline-block mt-2 text-[10px] font-mono bg-[#EBF7EE] text-[#0D6832] font-semibold px-2 py-0.5 rounded-sm">
                    Loaded {Math.round(htmlContent.length / 1024)} KB payload
                  </span>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Demo Website */}
          {activeTab === 'demo' && (
            <div className="p-4 bg-[#F8F9FC] border border-[#D8DADD] rounded-sm space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white border border-[#D8DADD] rounded-sm text-[#004AC6]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-[#191C1E]">
                    Preset: ApexCare Health Insurance (Enterprise B2B Demo)
                  </div>
                  <p className="text-[11px] text-[#434655] mt-0.5">
                    Realistic fictional health insurance SaaS featuring 485 words, 3 H2 headers, JSON-LD Product schema, missing canonical directive, and unannotated image tags for deterministic testing.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-mono">
                    <span className="bg-white border border-[#D8DADD] px-2 py-0.5 rounded-sm text-[#191C1E]">
                      Target SEO: 82/100
                    </span>
                    <span className="bg-white border border-[#D8DADD] px-2 py-0.5 rounded-sm text-[#004AC6]">
                      Target GEO: 64/100
                    </span>
                    <span className="bg-white border border-[#D8DADD] px-2 py-0.5 rounded-sm text-[#BA1A1A]">
                      1 Critical Issue
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Staged Orchestration Configuration */}
          <div className="pt-4 border-t border-[#D8DADD] space-y-2.5">
            <div className="text-[12px] font-bold text-[#434655] uppercase tracking-wider">
              Staged Audit Modules
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label 
                onClick={() => toggleConfig('runTechnical')}
                className="flex items-center gap-2 p-2 rounded-sm border border-[#D8DADD] bg-white cursor-pointer hover:bg-[#F8F9FC]"
              >
                {config.runTechnical ? (
                  <CheckSquare className="w-4 h-4 text-[#004AC6]" />
                ) : (
                  <Square className="w-4 h-4 text-[#434655]" />
                )}
                <div>
                  <div className="font-semibold text-[#191C1E]">Technical SEO Diagnostics</div>
                  <div className="text-[10px] text-[#434655]">Deterministic 10-point signals</div>
                </div>
              </label>

              <label 
                onClick={() => toggleConfig('runContent')}
                className="flex items-center gap-2 p-2 rounded-sm border border-[#D8DADD] bg-white cursor-pointer hover:bg-[#F8F9FC]"
              >
                {config.runContent ? (
                  <CheckSquare className="w-4 h-4 text-[#004AC6]" />
                ) : (
                  <Square className="w-4 h-4 text-[#434655]" />
                )}
                <div>
                  <div className="font-semibold text-[#191C1E]">Content & Search Intent</div>
                  <div className="text-[10px] text-[#434655]">Topic & intent alignment</div>
                </div>
              </label>

              <label 
                onClick={() => toggleConfig('runEntity')}
                className="flex items-center gap-2 p-2 rounded-sm border border-[#D8DADD] bg-white cursor-pointer hover:bg-[#F8F9FC]"
              >
                {config.runEntity ? (
                  <CheckSquare className="w-4 h-4 text-[#004AC6]" />
                ) : (
                  <Square className="w-4 h-4 text-[#434655]" />
                )}
                <div>
                  <div className="font-semibold text-[#191C1E]">Entity Analysis</div>
                  <div className="text-[10px] text-[#434655]">Knowledge graph mapping</div>
                </div>
              </label>

              <label 
                onClick={() => toggleConfig('runGeo')}
                className="flex items-center gap-2 p-2 rounded-sm border border-[#D8DADD] bg-white cursor-pointer hover:bg-[#F8F9FC]"
              >
                {config.runGeo ? (
                  <CheckSquare className="w-4 h-4 text-[#004AC6]" />
                ) : (
                  <Square className="w-4 h-4 text-[#434655]" />
                )}
                <div>
                  <div className="font-semibold text-[#191C1E]">GEO / AI Search Readiness</div>
                  <div className="text-[10px] text-[#434655]">6-dimension readiness framework</div>
                </div>
              </label>

              <label 
                onClick={() => toggleConfig('runEvaluation')}
                className="flex items-center gap-2 p-2 rounded-sm border border-[#D8DADD] bg-white cursor-pointer hover:bg-[#F8F9FC] sm:col-span-2"
              >
                {config.runEvaluation ? (
                  <CheckSquare className="w-4 h-4 text-[#004AC6]" />
                ) : (
                  <Square className="w-4 h-4 text-[#434655]" />
                )}
                <div>
                  <div className="font-semibold text-[#191C1E]">Recommendation Quality Evaluation</div>
                  <div className="text-[10px] text-[#434655]">Verify evidence support, specificity, and actionability</div>
                </div>
              </label>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#004AC6] hover:bg-[#2563EB] text-white text-xs font-semibold rounded-sm shadow-xs transition-colors"
            >
              <span>Execute Staged Audit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
