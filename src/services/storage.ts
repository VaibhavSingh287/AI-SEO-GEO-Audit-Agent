import { AuditReport, AppSettings } from '../types';
import { getDemoAuditReport } from './demoData';

const AUDITS_STORAGE_KEY = 'seo_geo_audits_v1';
const SETTINGS_STORAGE_KEY = 'seo_geo_settings_v1';

const DEFAULT_SETTINGS: AppSettings = {
  demoMode: true,
  aiProvider: 'offline_demo',
  includeEvidence: true,
  includeAiEvaluation: true
};

export class StorageService {
  public static getAudits(): AuditReport[] {
    try {
      const raw = localStorage.getItem(AUDITS_STORAGE_KEY);
      if (!raw) {
        // Initialize with default demo audit
        const defaultAudit = getDemoAuditReport();
        this.saveAudits([defaultAudit]);
        return [defaultAudit];
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      const defaultAudit = getDemoAuditReport();
      this.saveAudits([defaultAudit]);
      return [defaultAudit];
    } catch {
      return [getDemoAuditReport()];
    }
  }

  public static getAuditById(id: string): AuditReport | null {
    const audits = this.getAudits();
    return audits.find(a => a.id === id) || null;
  }

  public static saveAudit(audit: AuditReport): void {
    const audits = this.getAudits();
    const existingIndex = audits.findIndex(a => a.id === audit.id);
    if (existingIndex >= 0) {
      audits[existingIndex] = audit;
    } else {
      audits.unshift(audit);
    }
    this.saveAudits(audits);
  }

  public static deleteAudit(id: string): void {
    const audits = this.getAudits().filter(a => a.id !== id);
    this.saveAudits(audits);
  }

  public static duplicateAudit(id: string): AuditReport | null {
    const target = this.getAuditById(id);
    if (!target) return null;
    
    const clone: AuditReport = {
      ...JSON.parse(JSON.stringify(target)),
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      website: `${target.website} (Copy)`,
      createdAt: new Date().toISOString()
    };
    
    this.saveAudit(clone);
    return clone;
  }

  public static saveAudits(audits: AuditReport[]): void {
    try {
      localStorage.setItem(AUDITS_STORAGE_KEY, JSON.stringify(audits));
    } catch (e) {
      console.error('Failed to save audits to localStorage', e);
    }
  }

  public static getSettings(): AppSettings {
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!raw) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  public static saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }

  public static exportAuditJson(audit: AuditReport): void {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(audit, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `seo-geo-audit-${audit.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  public static resetToDemo(): void {
    try {
      localStorage.removeItem(AUDITS_STORAGE_KEY);
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
}
