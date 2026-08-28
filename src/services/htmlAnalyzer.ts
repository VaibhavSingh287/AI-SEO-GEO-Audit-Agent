import { NormalizedPageData, ImageDetail } from '../types';

export class HtmlAnalyzer {
  public static analyze(htmlString: string, baseUrl: string = 'https://example.com'): NormalizedPageData {
    if (!htmlString || typeof htmlString !== 'string') {
      return this.getEmptyData(baseUrl);
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');

      // Title
      const titleEl = doc.querySelector('title');
      const title = titleEl?.textContent?.trim() || '';

      // Meta Description
      const metaDescEl = doc.querySelector('meta[name="description"]') ||
                         doc.querySelector('meta[property="og:description"]');
      const metaDescription = metaDescEl?.getAttribute('content')?.trim() || '';

      // Canonical
      const canonicalEl = doc.querySelector('link[rel="canonical"]');
      const canonical = canonicalEl?.getAttribute('href')?.trim() || null;

      // Robots
      const robotsEl = doc.querySelector('meta[name="robots"]') ||
                       doc.querySelector('meta[name="googlebot"]');
      const robots = robotsEl?.getAttribute('content')?.trim() || null;

      // Headings
      const h1s: string[] = [];
      doc.querySelectorAll('h1').forEach(el => {
        const text = el.textContent?.trim();
        if (text) h1s.push(text);
      });

      const h2s: string[] = [];
      doc.querySelectorAll('h2').forEach(el => {
        const text = el.textContent?.trim();
        if (text) h2s.push(text);
      });

      const h3s: string[] = [];
      doc.querySelectorAll('h3').forEach(el => {
        const text = el.textContent?.trim();
        if (text) h3s.push(text);
      });

      // Base domain detection
      let hostDomain = '';
      try {
        const parsedUrl = new URL(baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
        hostDomain = parsedUrl.hostname.replace(/^www\./, '');
      } catch {
        hostDomain = 'example.com';
      }

      // Links
      let internalLinks = 0;
      let externalLinks = 0;
      const linkUrls: string[] = [];

      doc.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href')?.trim();
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
          return;
        }

        linkUrls.push(href);
        if (href.startsWith('/') || href.startsWith('./') || href.startsWith('../') || (hostDomain && href.includes(hostDomain))) {
          internalLinks++;
        } else if (href.startsWith('http://') || href.startsWith('https://')) {
          externalLinks++;
        } else {
          internalLinks++;
        }
      });

      // Images
      let totalImages = 0;
      let missingAlt = 0;
      const imageItems: ImageDetail[] = [];

      doc.querySelectorAll('img').forEach(img => {
        totalImages++;
        const src = img.getAttribute('src') || '';
        const alt = img.getAttribute('alt');
        const hasAlt = alt !== null && alt.trim().length > 0;
        if (!hasAlt) {
          missingAlt++;
        }
        if (imageItems.length < 15) {
          imageItems.push({
            src: src || '(inline / data-uri)',
            alt: alt || '',
            hasAlt
          });
        }
      });

      // Structured Data (JSON-LD)
      const schemaTypes: string[] = [];
      const rawSchemas: Record<string, unknown>[] = [];

      doc.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
        try {
          const content = script.textContent?.trim();
          if (content) {
            const parsed = JSON.parse(content);
            rawSchemas.push(parsed);
            
            const extractTypes = (obj: any) => {
              if (!obj || typeof obj !== 'object') return;
              if (Array.isArray(obj)) {
                obj.forEach(extractTypes);
              } else {
                if (obj['@type']) {
                  const t = Array.isArray(obj['@type']) ? obj['@type'] : [obj['@type']];
                  t.forEach((typeStr: string) => {
                    if (typeof typeStr === 'string' && !schemaTypes.includes(typeStr)) {
                      schemaTypes.push(typeStr);
                    }
                  });
                }
                if (obj['@graph'] && Array.isArray(obj['@graph'])) {
                  obj['@graph'].forEach(extractTypes);
                }
              }
            };
            extractTypes(parsed);
          }
        } catch {
          // Ignore invalid JSON-LD in raw script
        }
      });

      // Open Graph
      const openGraph: Record<string, string | undefined> = {};
      doc.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]').forEach(meta => {
        const prop = meta.getAttribute('property') || meta.getAttribute('name');
        const content = meta.getAttribute('content');
        if (prop && content) {
          const key = prop.replace('og:', '').replace('twitter:', 'twitter_');
          openGraph[key] = content;
        }
      });

      // Language & Viewport
      const language = doc.documentElement.getAttribute('lang') || null;
      const viewportEl = doc.querySelector('meta[name="viewport"]');
      const viewport = viewportEl?.getAttribute('content') || null;

      // Body text extraction (strip scripts, styles, noscript)
      const bodyClone = doc.body ? doc.body.cloneNode(true) as HTMLElement : null;
      if (bodyClone) {
        bodyClone.querySelectorAll('script, style, noscript, svg, path, iframe').forEach(el => el.remove());
      }
      const visibleText = (bodyClone?.textContent || doc.textContent || '')
        .replace(/\s+/g, ' ')
        .trim();

      const words = visibleText.length > 0 ? visibleText.split(/\s+/).filter(w => w.length > 0) : [];
      const wordCount = words.length;

      return {
        url: baseUrl,
        title,
        metaDescription,
        canonical,
        robots,
        headings: {
          h1: h1s,
          h2: h2s,
          h3: h3s
        },
        links: {
          internal: internalLinks,
          external: externalLinks,
          urls: linkUrls.slice(0, 30)
        },
        images: {
          total: totalImages,
          missingAlt,
          items: imageItems
        },
        structuredData: {
          types: schemaTypes,
          raw: rawSchemas
        },
        openGraph,
        language,
        viewport,
        wordCount,
        visibleText: visibleText.slice(0, 5000) // normalized text sample
      };
    } catch {
      return this.getEmptyData(baseUrl);
    }
  }

  private static getEmptyData(url: string): NormalizedPageData {
    return {
      url,
      title: '',
      metaDescription: '',
      canonical: null,
      robots: null,
      headings: { h1: [], h2: [], h3: [] },
      links: { internal: 0, external: 0, urls: [] },
      images: { total: 0, missingAlt: 0, items: [] },
      structuredData: { types: [], raw: [] },
      openGraph: {},
      language: null,
      viewport: null,
      wordCount: 0,
      visibleText: ''
    };
  }
}
