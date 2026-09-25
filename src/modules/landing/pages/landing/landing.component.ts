import {AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, PLATFORM_ID, Renderer2, signal} from '@angular/core';
import {DOCUMENT, isPlatformBrowser, NgOptimizedImage} from '@angular/common';
import {Meta, Title} from '@angular/platform-browser';
import {landingMetaConfig} from '../../config/landing-meta.config';
import {isGsapLoaded, loadGsap, onGsapLoaded} from '../../utils/gsap';
import {MarqueeDirective} from '../../directives/marquee.directive';
import {HeaderComponent} from '../../components/header/header.component';
import {HeroSectionComponent} from '../../components/hero/hero.component';
import {PromoShowSectionComponent} from '../../components/promo-show/promo-show.component';
import {AboutSectionComponent} from '../../components/about/about.component';
import {LecturesSectionComponent} from '../../components/lectures/lectures.component';
import {MediaSectionComponent} from '../../components/media/media.component';
import {ContactsSectionComponent} from '../../components/contacts/contacts.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  imports: [
    MarqueeDirective,
    HeaderComponent,
    HeroSectionComponent,
    PromoShowSectionComponent,
    AboutSectionComponent,
    LecturesSectionComponent,
    MediaSectionComponent,
    ContactsSectionComponent,
    NgOptimizedImage,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject<Document>(DOCUMENT);
  private styleObserver: MutationObserver | null = null;
  private setTimeoutIds: ReturnType<typeof setTimeout>[] = [];
  private structuredDataScript: HTMLScriptElement | null = null;

  private readonly managedMetaSelectors = [
    'name="description"',
    'name="robots"',
    'rel="canonical"',
    'property="og:type"',
    'property="og:locale"',
    'property="og:site_name"',
    'property="og:title"',
    'property="og:description"',
    'property="og:url"',
    'property="og:image"',
    'name="twitter:card"',
    'name="twitter:title"',
    'name="twitter:description"',
    'name="twitter:image"',
  ];

  protected showPromo = signal(false);
  protected showAbout = signal(false);
  protected showLectures = signal(false);
  protected showMedia = signal(false);
  protected showContacts = signal(false);

  private readonly sectionOrder = ['shows', 'about', 'lectures', 'media', 'contacts'];
  private sectionSignals: Record<string, () => void> = {
    shows: () => this.showPromo.set(true),
    about: () => this.showAbout.set(true),
    lectures: () => this.showLectures.set(true),
    media: () => this.showMedia.set(true),
    contacts: () => this.showContacts.set(true),
  };

  protected items: {label: string; href: string; block?: ScrollLogicalPosition; offset?: number}[] = [
    {label: 'Главная', href: '#hero'},
    {label: 'Выступления', href: '#shows', offset: 100},
    {label: 'Об александре', href: '#about'},
    {label: 'Шоу и лекции', href: '#lectures'},
    {label: 'Медиа', href: '#media'},
    {label: 'Контакты', href: '#contacts'},
  ];

  protected ribbonItems = [
    {id: 1, icon: '/assets/images/image_1.webp', description: 'Самый титулованный \nменталист СНГ', width: '48', height: '79'},
    {id: 2, icon: '/assets/images/image_2.webp', description: '15+ лет \nна сцене', width: '80', height: '75'},
    {id: 3, icon: '/assets/images/image_3.webp', description: 'Создатель авторских \nшоу и эффектов', width: '60', height: '79'},
    {id: 4, icon: '/assets/images/image_4.webp', description: 'Консультант\nТВ-проектов', width: '79', height: '78'},
    {id: 5, icon: '/assets/images/image_5.webp', description: 'Дипломированный \nпсихолог', width: '97', height: '79'},
    {id: 6, icon: '/assets/images/image_6.webp', description: 'Спикер международных\nфестивалей', width: '142', height: '78'},
  ];

  constructor() {
    this.applyMeta(landingMetaConfig);

    if (isPlatformBrowser(this.platformId)) {
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }

    inject(DestroyRef).onDestroy(() => {
      this.styleObserver?.disconnect();
    });
  }

  private applyMeta(config: typeof landingMetaConfig): void {
    this.managedMetaSelectors.forEach(selector => this.meta.removeTag(selector));

    this.title.setTitle(config.title);
    this.meta.addTag({name: 'description', content: config.description});
    this.meta.addTag({name: 'robots', content: config.robots});
    this.meta.addTag({rel: 'canonical', href: config.canonical});
    this.meta.addTag({property: 'og:type', content: config.og.type});
    this.meta.addTag({property: 'og:locale', content: config.og.locale});
    this.meta.addTag({property: 'og:site_name', content: config.og.siteName});
    this.meta.addTag({property: 'og:title', content: config.og.title});
    this.meta.addTag({property: 'og:description', content: config.og.description});
    this.meta.addTag({property: 'og:url', content: config.og.url});
    this.meta.addTag({property: 'og:image', content: config.og.image});
    this.meta.addTag({name: 'twitter:card', content: config.twitter.card});
    this.meta.addTag({name: 'twitter:title', content: config.twitter.title});
    this.meta.addTag({name: 'twitter:description', content: config.twitter.description});
    this.meta.addTag({name: 'twitter:image', content: config.twitter.image});

    this.setStructuredData(config.structuredData);
  }

  private setStructuredData(data: Record<string, unknown>): void {
    this.removeStructuredData();
    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'type', 'application/ld+json');
    this.renderer.setProperty(script, 'textContent', JSON.stringify(data));
    this.renderer.appendChild(this.document.head, script);
    this.structuredDataScript = script;
  }

  private removeStructuredData(): void {
    if (!this.structuredDataScript) return;
    this.renderer.removeChild(this.document.head, this.structuredDataScript);
    this.structuredDataScript = null;
  }

  protected onSectionClick(id: string, block: ScrollLogicalPosition = 'start', offset = 0): void {
    const sectionId = id.split('-')[0];
    const targetIndex = this.sectionOrder.indexOf(sectionId);
    this.sectionOrder.forEach((key, i) => {
      if (i <= targetIndex) {
        this.sectionSignals[key]?.();
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      this.setTimeoutIds.push(setTimeout(() => {
        this.scrollToSection(id, block, offset);
      }));
    }
  }

  private scrollToSection(id: string, block: ScrollLogicalPosition, offset: number): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const tryScroll = (): boolean => {
      const el = document.getElementById(id);
      if (!el) return false;
      if (offset) {
        const y = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({top: y, behavior: 'smooth'});
      } else {
        el.scrollIntoView({behavior: 'smooth', block});
      }
      return true;
    };

    if (tryScroll()) return;

    let attempts = 0;
    const retry = (): void => {
      if (tryScroll() || ++attempts > 40) return;
      const t = setTimeout(retry, 50);
      this.setTimeoutIds.push(t);
    };
    const t = setTimeout(retry, 50);
    this.setTimeoutIds.push(t);
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
      this.watchStyleChanges();
      onGsapLoaded(() => {
        this.setTimeoutIds.push(setTimeout(() => {
          this.refreshScrollTriggers();
        }, 200));
      });
    }
  }

  private refreshScrollTriggers(): void {
    if (!isGsapLoaded()) return;
    void loadGsap().then(({ScrollTrigger}) => ScrollTrigger.refresh(true));
  }

  private watchStyleChanges(): void {
    let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

    const scheduleRefresh = () => {
      if (!isGsapLoaded()) return;
      if (refreshTimeout) clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        this.refreshScrollTriggers();
      }, 100);
    };

    this.styleObserver = new MutationObserver(scheduleRefresh);

    this.styleObserver.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });
  }

  ngOnDestroy(): void {
    this.removeStructuredData();
    this.styleObserver?.disconnect();
    this.setTimeoutIds.forEach(id => clearTimeout(id));
    if (isPlatformBrowser(this.platformId) && isGsapLoaded()) {
      void loadGsap().then(({gsap, ScrollTrigger}) => {
        ScrollTrigger.getAll().forEach(t => t.kill());
        gsap.killTweensOf(document.querySelectorAll('.reveal-on-scroll, .dim-on-scroll'));
      });
    }
  }
}
