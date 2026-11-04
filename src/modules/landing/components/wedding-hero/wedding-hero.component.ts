import {Component, ElementRef, inject, output, PLATFORM_ID, viewChild} from '@angular/core';
import {isPlatformBrowser, NgOptimizedImage} from "@angular/common";
import {type Gsap, loadGsap, ScrollTrigger} from '@modules/landing/utils/gsap';

@Component({
  selector: 'app-wedding-hero',
    imports: [
        NgOptimizedImage
    ],
  templateUrl: './wedding-hero.component.html',
  styleUrl: './wedding-hero.component.scss',
})
export class WeddingHeroComponent {
  private platformId = inject(PLATFORM_ID);
  private scrollTriggers: ScrollTrigger[] = [];

  bg = viewChild<ElementRef<HTMLElement>>('bg');
  sectionClick = output<{id: string; block: ScrollLogicalPosition; offset: number}>();

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (window.innerWidth < 768) return;

    void loadGsap().then(({gsap}) => this.initParallax(gsap));
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach(t => t.kill());
  }

  private initParallax(gsap: Gsap): void {
    const heroEl = document.getElementById('wedding');
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
