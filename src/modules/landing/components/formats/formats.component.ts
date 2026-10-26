import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject, OnDestroy,
  output,
  PLATFORM_ID,
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

  bg = viewChild<ElementRef<HTMLElement>>('bg');
  sectionClick = output<{id: string; block: ScrollLogicalPosition; offset: number}>();

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (window.innerWidth < 768) return;

    void loadGsap().then(({gsap}) => this.initParallax(gsap));
  }

  private initParallax(gsap: Gsap): void {
    const heroEl = document.getElementById('scene');
    const bgEl = this.bg()?.nativeElement;
    if (!heroEl || !bgEl) return;

    const bgTrigger = gsap.to(bgEl, {
      y: 300,
      ease: 'none',
      scrollTrigger: {
        trigger: heroEl,
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
