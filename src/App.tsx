import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { NewAuditView } from './components/NewAuditView';
import { AuditProgressView } from './components/AuditProgressView';
import { AuditOverviewView } from './components/AuditOverviewView';
import { TechnicalSeoView } from './components/TechnicalSeoView';
import { ContentView } from './components/ContentView';
import { EntityView } from './components/EntityView';
import { GeoView } from './components/GeoView';
import { RecommendationsView } from './components/RecommendationsView';
import { AiEvaluationView } from './components/AiEvaluationView';
import { ReportView } from './components/ReportView';
import { AuditHistoryView } from './components/AuditHistoryView';
import { SettingsView } from './components/SettingsView';

import { AuditReport, AppSettings, AuditStageInfo, AuditConfiguration } from './types';
import { StorageService } from './services/storage';
import { AuditOrchestrator } from './services/auditOrchestrator';
import { getDemoAuditReport } from './services/demoData';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getSettings());
  const [audits, setAudits] = useState<AuditReport[]>(() => StorageService.getAudits());
  const [activeAudit, setActiveAudit] = useState<AuditReport | null>(() => {
    const list = StorageService.getAudits();
    return list.length > 0 ? list[0] : getDemoAuditReport();
  });
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [activeRecommendationId, setActiveRecommendationId] = useState<string | null>(null);

  // Orchestrator Progress State
  const [stages, setStages] = useState<AuditStageInfo[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [orchestratorError, setOrchestratorError] = useState<string | undefined>(undefined);
  const [orchestratorHint, setOrchestratorHint] = useState<string | undefined>(undefined);

  // Sync audits list
  const refreshAudits = () => {
    const fresh = StorageService.getAudits();
    setAudits(fresh);
    if (activeAudit && !fresh.find(a => a.id === activeAudit.id)) {
      setActiveAudit(fresh.length > 0 ? fresh[0] : null);
    }
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  const handleResetDemo = () => {
    StorageService.resetToDemo();
    const fresh = StorageService.getAudits();
    setAudits(fresh);
    setActiveAudit(fresh[0] || null);
    setSettings(StorageService.getSettings());
    setCurrentView('dashboard');
  };

  const handleSelectAudit = (audit: AuditReport, targetTab: string = 'audit_overview') => {
    setActiveAudit(audit);
    setCurrentView(targetTab);
  };

  const handleOpenRecommendation = (recId: string) => {
    setActiveRecommendationId(recId);
    setCurrentView('audit_recommendations');
  };

  // Launch Staged Audit
  const handleStartAudit = async (
    input: { type: 'url' | 'html' | 'demo'; value?: string; url?: string },
    config: AuditConfiguration
  ) => {
    setOrchestratorError(undefined);
    setOrchestratorHint(undefined);
    setOverallProgress(0);
    setCurrentView('progress');

    const result = await AuditOrchestrator.executeAudit(
      input,
      config,
      settings,
      (updatedStages, progress) => {
        setStages(updatedStages);
        setOverallProgress(progress);
      }
    );

    if (result.success && result.report) {
      refreshAudits();
      setActiveAudit(result.report);
      setCurrentView('audit_overview');
    } else {
      setOrchestratorError(result.error || 'Audit analysis was interrupted.');
      setOrchestratorHint(result.hint);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#191C1E] flex flex-col font-sans antialiased selection:bg-[#004AC6]/15 selection:text-[#004AC6]">
      
      {/* Top Enterprise Bar */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        settings={settings}
        activeAudit={activeAudit}
        activeAuditName={activeAudit?.website}
      />

      {/* Main Responsive Grid Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
        
        {/* Navigation Sidebar */}
        <Navigation
          currentView={currentView}
          onNavigate={setCurrentView}
          activeAudit={activeAudit}
          settings={settings}
        />

        {/* Dynamic Main Stage View */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              audits={audits}
              onSelectAudit={handleSelectAudit}
              onNavigate={setCurrentView}
              onRefreshAudits={refreshAudits}
            />
          )}

          {currentView === 'new_audit' && (
            <NewAuditView
              onStartAudit={handleStartAudit}
              settings={settings}
            />
          )}

          {currentView === 'progress' && (
            <AuditProgressView
              stages={stages}
              overallProgress={overallProgress}
              error={orchestratorError}
              hint={orchestratorHint}
              onRetryWithDemo={() => handleStartAudit({ type: 'demo' }, {
                runTechnical: true,
                runContent: true,
                runEntity: true,
                runGeo: true,
                runEvaluation: true
              })}
              onGoToUpload={() => setCurrentView('new_audit')}
            />
          )}

          {currentView === 'audit_overview' && activeAudit && (
            <AuditOverviewView
              audit={activeAudit}
              onNavigateTab={setCurrentView}
              onOpenRecommendation={handleOpenRecommendation}
            />
          )}

          {currentView === 'audit_technical' && activeAudit && (
            <TechnicalSeoView
              technical={activeAudit.technicalSeo}
            />
          )}

          {currentView === 'audit_content' && activeAudit && (
            <ContentView
              content={activeAudit.contentAnalysis}
            />
          )}

          {currentView === 'audit_entity' && activeAudit && (
            <EntityView
              entityAnalysis={activeAudit.entityAnalysis}
            />
          )}

          {currentView === 'audit_geo' && activeAudit && (
            <GeoView
              geoAnalysis={activeAudit.geoAnalysis}
            />
          )}

          {currentView === 'audit_recommendations' && activeAudit && (
            <RecommendationsView
              recommendations={activeAudit.recommendations}
              initialSelectedId={activeRecommendationId}
            />
          )}

          {currentView === 'audit_evaluation' && activeAudit && (
            <AiEvaluationView
              evaluation={activeAudit.evaluation}
            />
          )}

          {currentView === 'report' && activeAudit && (
            <ReportView
              audit={activeAudit}
            />
          )}

          {currentView === 'history' && (
            <AuditHistoryView
              audits={audits}
              onSelectAudit={handleSelectAudit}
              onNavigate={setCurrentView}
              onRefreshAudits={refreshAudits}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onResetDemo={handleResetDemo}
            />
          )}
        </main>

      </div>

    </div>
  );
}
