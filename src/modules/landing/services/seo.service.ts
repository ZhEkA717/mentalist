import {DOCUMENT} from '@angular/common';
import {inject, Injectable, OnDestroy} from '@angular/core';
import {Meta, MetaDefinition, Title} from '@angular/platform-browser';
import {PageMetaConfig} from '../config/meta-config.types';

@Injectable()
export class SeoService implements OnDestroy {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);

  private structuredDataScripts: HTMLScriptElement[] = [];

  apply(config: PageMetaConfig): void {
    this.title.setTitle(config.title);

    this.upsert({name: 'description'}, config.description);
    this.upsert({name: 'robots'}, config.robots);

    this.upsert({property: 'og:type'}, config.og.type);
    this.upsert({property: 'og:locale'}, config.og.locale);
    this.upsert({property: 'og:site_name'}, config.og.siteName);
    this.upsert({property: 'og:title'}, config.og.title);
    this.upsert({property: 'og:description'}, config.og.description);
    this.upsert({property: 'og:url'}, config.siteUrl + config.path);
    this.upsert({property: 'og:image'}, config.og.image);

    this.upsert({name: 'twitter:card'}, config.twitter.card);
    this.upsert({name: 'twitter:title'}, config.twitter.title);
    this.upsert({name: 'twitter:description'}, config.twitter.description);
    this.upsert({name: 'twitter:image'}, config.twitter.image);

    this.setCanonical(config.siteUrl + config.path);
    this.setStructuredData(config);
  }

  ngOnDestroy(): void {
    this.removeStructuredData();
  }

  private upsert(def: MetaDefinition, content: string): void {
    const tag: MetaDefinition = {...def, content};
    const selector = this.selectorOf(def);
    if (selector && this.meta.getTag(selector)) {
      this.meta.updateTag(tag, selector);
    } else {
      this.meta.addTag(tag);
    }
  }

  private selectorOf(def: MetaDefinition): string | null {
    if (def.name) return `name="${def.name}"`;
    if (def.property) return `property="${def.property}"`;
    return null;
  }

  private setCanonical(href: string): void {
    const doc = this.document;
    let link = doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      doc.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private setStructuredData(config: PageMetaConfig): void {
    this.removeStructuredData();
    // Убираем JSON-LD других страниц (например, при клиентской навигации)
    this.document
      .querySelectorAll<HTMLScriptElement>('script[data-seo-page]')
      .forEach(script => script.parentNode?.removeChild(script));

    for (const item of config.structuredData) {
      const script = this.document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-seo-page', config.path);
      script.textContent = JSON.stringify(item);
      this.document.head.appendChild(script);
      this.structuredDataScripts.push(script);
    }
  }

  private removeStructuredData(): void {
    for (const script of this.structuredDataScripts) {
      script.parentNode?.removeChild(script);
    }
    this.structuredDataScripts = [];
  }
}
