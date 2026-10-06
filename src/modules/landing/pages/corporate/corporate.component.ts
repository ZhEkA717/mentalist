import {AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {HeaderComponent, HeaderItem} from '../../components/header/header.component';
import {CorporateHeroSectionComponent} from '../../components/corporate-hero/corporate-hero.component';
import {ContactsSectionComponent} from '../../components/contacts/contacts.component';
import {corporateMetaConfig} from '../../config/corporate-meta.config';

@Component({
  selector: 'app-corporate',
  standalone: true,
  templateUrl: './corporate.component.html',
  styleUrl: './corporate.component.scss',
  imports: [
    HeaderComponent,
    CorporateHeroSectionComponent,
    ContactsSectionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorporateComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private readonly title = inject(Title);
  private setTimeoutIds: ReturnType<typeof setTimeout>[] = [];

  protected items: HeaderItem[] = [
    {label: 'Главная', route: '/'},
    {label: 'Корпоратив', href: '#corporate', route: '/corporate'},
    {label: 'Форматы', href: '#formats'},
    {label: 'Отзывы', href: '#reviews'},
    {label: 'Медиа', href: '#media'},
    {label: 'Вопросы', href: '#faq'},
    {label: 'Контакты', href: '#contacts'},
  ];

  constructor() {
    this.title.setTitle(corporateMetaConfig.title);
  }

  protected onSectionClick(id: string, block: ScrollLogicalPosition = 'start', offset = 0): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.setTimeoutIds.push(setTimeout(() => {
      this.scrollToSection(id, block, offset);
    }));
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
    }
  }

  ngOnDestroy(): void {
    this.setTimeoutIds.forEach(id => clearTimeout(id));
  }
}
