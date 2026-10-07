import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {
  ReviewCardComponent,
  ReviewCardData,
} from '../review-card/review-card.component';
import {CarouselComponent} from '../carousel/carousel.component';
import {initRevealOnScroll} from '../../utils/scroll-animations';
import {killGsapTweens} from '../../utils/gsap';
import type {ScrollTrigger} from '../../utils/gsap';

@Component({
  selector: 'app-reviews-section',
  imports: [CarouselComponent, ReviewCardComponent],
  templateUrl: './reviews-section.component.html',
  styleUrl: './reviews-section.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewsSectionComponent implements AfterViewInit, OnDestroy {
  items = input<ReviewCardData[]>([]);

  private platformId = inject(PLATFORM_ID);
  private readonly el = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    void initRevealOnScroll(this.el.nativeElement).then(triggers => {
      this.triggers.push(...triggers);
    });
    this.destroyRef.onDestroy(() => {
      this.triggers.forEach(t => t.kill());
      if (isPlatformBrowser(this.platformId)) {
        killGsapTweens(this.el.nativeElement.querySelectorAll('.reveal-on-scroll'));
      }
    });
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
    if (isPlatformBrowser(this.platformId)) {
      killGsapTweens(this.el.nativeElement.querySelectorAll('.reveal-on-scroll'));
    }
  }
}