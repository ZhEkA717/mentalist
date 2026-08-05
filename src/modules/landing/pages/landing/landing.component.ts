import {AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, signal} from '@angular/core';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {MarqueeDirective} from '../../directives/marquee.directive';
import {HeaderComponent} from '../../components/header/header.component';
import {HeroSectionComponent} from '../../components/hero/hero.component';
import {PromoShowSectionComponent} from '../../components/promo-show/promo-show.component';
import {AboutSectionComponent} from '../../components/about/about.component';
import {LecturesSectionComponent} from '../../components/lectures/lectures.component';
import {MediaSectionComponent} from '../../components/media/media.component';
import {ContactsSectionComponent} from '../../components/contacts/contacts.component';

gsap.registerPlugin(ScrollTrigger);

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  private styleObserver: MutationObserver | null = null;

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

  protected items: {label: string; href: string}[] = [
    {label: 'Главная', href: '#hero'},
    {label: 'Выступления', href: '#shows'},
    {label: 'Об александре', href: '#about'},
    {label: 'Шоу и лекции', href: '#lectures'},
    {label: 'Медиа', href: '#media'},
    {label: 'Контакты', href: '#contacts'},
  ];

  protected ribbonItems = [
    {id: 1, icon: 'assets/images/image_1.png', description: 'Самый титулованный \nменталист СНГ'},
    {id: 2, icon: 'assets/images/image_2.png', description: '15+ лет \nна сцене'},
    {id: 3, icon: 'assets/images/image_3.png', description: 'Создатель авторских \nшоу и эффектов'},
    {id: 4, icon: 'assets/images/image_4.png', description: 'Консультант\nТВ-проектов'},
    {id: 5, icon: 'assets/images/image_5.png', description: 'Дипломированный \nпсихолог'},
    {id: 6, icon: 'assets/images/image_6.png', description: 'Спикер международных\nфестивалей'},
  ];

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.styleObserver?.disconnect();
    });
  }

  protected onSectionClick(id: string): void {
    const targetIndex = this.sectionOrder.indexOf(id);
    this.sectionOrder.forEach((key, i) => {
      if (i <= targetIndex) {
        this.sectionSignals[key]?.();
      }
    });

    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({behavior: 'smooth', block: 'center'});
      }
    })
  }

  ngAfterViewInit(): void {
    this.watchStyleChanges();
    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 200);
  }

  private watchStyleChanges(): void {
    let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

    const scheduleRefresh = () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh(true);
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
    this.styleObserver?.disconnect();
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.killTweensOf('*');
  }
}
