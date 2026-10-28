import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject, OnDestroy,
  output,
  PLATFORM_ID,
  signal,
  viewChild
} from '@angular/core';
import {Gsap, loadGsap, ScrollTrigger} from '@modules/landing/utils/gsap';
import {isPlatformBrowser, NgOptimizedImage, NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'app-formats',
  imports: [
    NgTemplateOutlet,
    NgOptimizedImage
  ],
  templateUrl: './formats.component.html',
  styleUrl: './formats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormatsComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private scrollTriggers: ScrollTrigger[] = [];

  sceneBg = viewChild<ElementRef<HTMLElement>>('sceneBg');
  tableBg = viewChild<ElementRef<HTMLElement>>('tableBg');
  mentalismBg = viewChild<ElementRef<HTMLElement>>('mentalismBg');
  sectionClick = output<{id: string; block: ScrollLogicalPosition; offset: number}>();

  readonly descriptionOpenScene = signal(false);
  readonly descriptionOpenMentalism = signal(false);
  readonly descriptionOpenTable = signal(false);

  toggleDescriptionScene(): void {
    this.descriptionOpenScene.update(open => !open);
  }

  toggleDescriptionMentalism(): void {
    this.descriptionOpenMentalism.update(open => !open);
  }

  toggleDescriptionTable(): void {
    this.descriptionOpenTable.update(open => !open);
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (window.innerWidth < 768) return;

    void loadGsap().then(({gsap}) => this.initParallax(gsap));
  }

  private initParallax(gsap: Gsap): void {
    this.setupParallax(gsap, 'scene', this.sceneBg()?.nativeElement);
    this.setupParallax(gsap, 'table', this.tableBg()?.nativeElement);
    this.setupParallax(gsap, 'mentalism', this.mentalismBg()?.nativeElement);
  }

  private setupParallax(gsap: Gsap, sectionId: string, bgEl: HTMLElement | undefined): void {
    const sectionEl = document.getElementById(sectionId);
    if (!sectionEl || !bgEl) return;

    const bgTrigger = gsap.to(bgEl, {
      y: 300,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionEl,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
    if (bgTrigger.scrollTrigger) this.scrollTriggers.push(bgTrigger.scrollTrigger);
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach(t => t.kill());
  }
}
