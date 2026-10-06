import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  output,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import {isPlatformBrowser, NgOptimizedImage} from '@angular/common';
import type {Gsap, ScrollTrigger} from '../../utils/gsap';
import {loadGsap} from '../../utils/gsap';

@Component({
  selector: 'app-corporate-hero',
  standalone: true,
  templateUrl: './corporate-hero.component.html',
  styleUrl: './corporate-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgOptimizedImage
  ]
})
export class CorporateHeroSectionComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private scrollTriggers: ScrollTrigger[] = [];

  bg = viewChild<ElementRef<HTMLElement>>('bg');
  sectionClick = output<{id: string; block: ScrollLogicalPosition; offset: number}>();

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    void loadGsap().then(({gsap}) => this.initParallax(gsap));
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach(t => t.kill());
  }

  private initParallax(gsap: Gsap): void {
    const heroEl = document.getElementById('corporate');
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

  protected scrollTo(event: Event, id: string, block: ScrollLogicalPosition = 'start'): void {
    event.preventDefault();
    this.sectionClick.emit({id, block, offset: 0});
  }
}
