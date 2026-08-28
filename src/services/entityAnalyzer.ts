import { NormalizedPageData, EntityItem, EntityRelationship, EntityAnalysisResult, EntityType } from '../types';

export class EntityAnalyzer {
  public static analyze(data: NormalizedPageData): EntityAnalysisResult {
    const text = data.visibleText || '';
    const entities: EntityItem[] = [];
    const relationships: EntityRelationship[] = [];

    // 1. Primary Organization / Brand Entity
    let brandName = data.openGraph.siteName || '';
    if (!brandName && data.title) {
      const parts = data.title.split(/[-|•—:]/);
      if (parts.length > 1) {
        brandName = parts[parts.length - 1].trim();
      } else {
        brandName = parts[0].trim();
      }
    }
    if (!brandName) {
      try {
        const u = new URL(data.url.startsWith('http') ? data.url : `https://${data.url}`);
        brandName = u.hostname.replace(/^www\./, '').split('.')[0];
        brandName = brandName.charAt(0).toUpperCase() + brandName.slice(1);
      } catch {
        brandName = 'Primary Brand Entity';
      }
    }

    const hasOrgSchema = data.structuredData.types.includes('Organization') || 
                         data.structuredData.types.includes('Corporation');

    entities.push({
      id: 'entity-brand-1',
      entity: brandName,
      type: 'Organization',
      confidence: hasOrgSchema ? 0.95 : 0.84,
      clarity: hasOrgSchema ? 0.92 : 0.72,
      description: `Primary organization entity extracted from domain metadata and title markers.`,
      evidence: hasOrgSchema 
        ? `Found in schema types [${data.structuredData.types.join(', ')}] and OpenGraph site name.` 
        : `Extracted from page title "${data.title}" and domain anchors. (No Organization JSON-LD declared).`
    });

    // 2. Primary Product or Service
    let mainService = '';
    if (data.headings.h1.length > 0) {
      mainService = data.headings.h1[0].replace(/^(welcome to|introducing|the best)\s+/i, '');
    } else {
      mainService = data.title.split(/[-|•—]/)[0]?.trim() || 'Core Enterprise Service';
    }

    if (mainService && mainService !== brandName) {
      const isProduct = /\b(software|platform|app|tool|suite|system|device|plan|kit)\b/i.test(mainService) ||
                        data.structuredData.types.includes('Product') ||
                        data.structuredData.types.includes('SoftwareApplication');

      const entityType: EntityType = isProduct ? 'Product' : 'Service';
      entities.push({
        id: 'entity-svc-1',
        entity: mainService,
        type: entityType,
        confidence: 0.88,
        clarity: 0.82,
        description: `Primary ${entityType.toLowerCase()} offering highlighted as the central thematic subject of the document.`,
        evidence: `Directly anchored in H1 header "${data.headings.h1[0] || data.title}".`
      });

      relationships.push({
        source: brandName,
        target: mainService,
        relationship: isProduct ? 'manufactures / develops' : 'provides / offers'
      });
    }

    // 3. Category / Domain Entities
    const categoryMatches: { term: string; count: number }[] = [];
    const keywords = ['healthcare', 'health insurance', 'cloud analytics', 'cybersecurity', 'enterprise software', 'coffee', 'consulting', 'financial services', 'telecommunications', 'logistics', 'compliance', 'seo', 'data management'];
    
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches && matches.length >= 2) {
        categoryMatches.push({ term: kw.toUpperCase(), count: matches.length });
      }
    });

    if (categoryMatches.length > 0) {
      categoryMatches.slice(0, 2).forEach((cat, idx) => {
        entities.push({
          id: `entity-cat-${idx + 1}`,
          entity: cat.term,
          type: 'Category',
          confidence: 0.85,
          clarity: 0.78,
          description: `Industry vertical category identified through repeated semantic co-occurrences.`,
          evidence: `Occurs ${cat.count} times across body text and section headers.`
        });

        relationships.push({
          source: mainService || brandName,
          target: cat.term,
          relationship: 'operates within industry vertical'
        });
      });
    }

    // 4. Location or Person Entities
    const locationRegex = /\b(United States|New York|San Francisco|London|California|Austin|Chicago|Tokyo|Berlin|Canada|Europe)\b/i;
    const locationMatch = text.match(locationRegex);
    if (locationMatch) {
      const locName = locationMatch[0];
      entities.push({
        id: 'entity-loc-1',
        entity: locName,
        type: 'Location',
        confidence: 0.81,
        clarity: 0.75,
        description: 'Geographic entity referenced for regional presence and market jurisdiction.',
        evidence: `Identified in address or market coverage text ("${locName}").`
      });

      relationships.push({
        source: brandName,
        target: locName,
        relationship: 'headquartered in / serves region'
      });
    }

    // Compute Entity Score
    let entityScore = 65;
    if (hasOrgSchema) entityScore += 18;
    if (entities.length >= 3) entityScore += 12;
    if (relationships.length >= 2) entityScore += 5;
    entityScore = Math.min(95, Math.max(45, entityScore));

    const summary = `Identified ${entities.length} core knowledge graph entities with ${relationships.length} explicit conceptual relationships. ${hasOrgSchema ? 'Organization structured schema explicitly grounds brand identity.' : 'Missing Organization JSON-LD reduces machine entity disambiguation.'}`;

    return {
      score: entityScore,
      entities,
      relationships,
      summary
    };
  }
}
