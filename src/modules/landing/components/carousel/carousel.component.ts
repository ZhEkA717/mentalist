import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  OnDestroy,
  signal,
  TemplateRef,
} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {GalleryComponent} from '../gallery/gallery.component';
import {ImageSkeletonDirective} from '../../directives/image-skeleton.directive';
import {MediaIndicatorsComponent} from '@modules/landing/components/media-indicators/media-indicators.component';
import {sliderPictureSources, SliderItem} from '@modules/landing/models/slider-item';

const DEFAULT_ACTIVE_WIDTH = 425;
const DEFAULT_ACTIVE_HEIGHT = 283;
const DEFAULT_SIDE_WIDTH = 244;
const DEFAULT_SIDE_HEIGHT = 163;
const DEFAULT_FAR_SCALE = 0.6;
const DEFAULT_SLIDE_GAP = 16;

@Component({
  selector: 'app-carousel',
  imports: [
    GalleryComponent,
    MediaIndicatorsComponent,
    ImageSkeletonDirective,
    NgTemplateOutlet,
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent implements OnDestroy {
  items = input<unknown[]>([]);
  protected readonly slideTemplate = contentChild<TemplateRef<{$implicit: unknown; index: number}>>(
    'slideTemplate',
  );

  activeWidth = input<number>(DEFAULT_ACTIVE_WIDTH);
  activeHeight = input<number>(DEFAULT_ACTIVE_HEIGHT);
  sideSlideWidth = input<number>(DEFAULT_SIDE_WIDTH);
  sideSlideHeight = input<number>(DEFAULT_SIDE_HEIGHT);
  farScale = input<number>(DEFAULT_FAR_SCALE);
  slideGap = input<number>(DEFAULT_SLIDE_GAP);
  galleryEnabled = input<boolean>(true);
  slideBorderPadding = input<number>(0);

  protected currentSlideIndex = signal(0);

  private readonly transitionMs = 500;
  private animating = false;
  private animTimer: ReturnType<typeof setTimeout> | null = null;

  private touchStartX = 0;
  private touchStartY = 0;
  private blockedClick = false;
  galleryOpen = signal(false);
  galleryIndex = signal(0);

  protected readonly sliderItems = computed<SliderItem[]>(() => this.items() as SliderItem[]);
  protected readonly sliderPictureSources = sliderPictureSources;

  protected get totalSlides(): number {
    return this.items().length;
  }

  protected openGallery(index: number): void {
    if (!this.galleryEnabled()) return;
    if (this.blockedClick) {
      this.blockedClick = false;
      return;
    }
    this.galleryIndex.set(index);
    this.galleryOpen.set(true);
  }

  protected onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  protected onTouchCancel(): void {
    this.touchStartX = 0;
    this.touchStartY = 0;
  }

  protected onTouchEnd(event: TouchEvent): void {
    const dx = event.changedTouches[0].clientX - this.touchStartX;
    const dy = event.changedTouches[0].clientY - this.touchStartY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      this.blockedClick = true;
      if (dx < 0) this.nextSlide();
      else this.prevSlide();
      setTimeout(() => (this.blockedClick = false), 60);
    }
  }

  protected isSlideNearby(index: number): boolean {
    const diff = index - this.currentSlideIndex();
    const total = this.totalSlides;
    let normalizedDiff = diff;
    if (diff > total / 2) normalizedDiff = diff - total;
    if (diff < -total / 2) normalizedDiff = diff + total;
    return Math.abs(normalizedDiff) <= 1;
  }

  protected prevSlide(): void {
    if (this.animating) return;
    this.changeSlide(
      (this.currentSlideIndex() - 1 + this.totalSlides) % this.totalSlides,
    );
  }

  protected nextSlide(): void {
    if (this.animating) return;
    this.changeSlide((this.currentSlideIndex() + 1) % this.totalSlides);
  }

  protected goToSlide(index: number): void {
    if (this.animating || index === this.currentSlideIndex()) return;
    this.changeSlide(index);
  }

  private changeSlide(index: number): void {
    this.animating = true;
    this.currentSlideIndex.set(index);
    this.animTimer = setTimeout(() => (this.animating = false), this.transitionMs);
  }

  ngOnDestroy(): void {
    if (this.animTimer !== null) clearTimeout(this.animTimer);
  }

  protected getSliderStyle(index: number): Record<string, string> {
    const diff = index - this.currentSlideIndex();
    const total = this.totalSlides;

    let normalizedDiff = diff;
    if (diff > total / 2) normalizedDiff = diff - total;
    if (diff < -total / 2) normalizedDiff = diff + total;

    const absDiff = Math.abs(normalizedDiff);
    const activeW = this.activeWidth();
    const activeH = this.activeHeight();
    const sideW = this.sideSlideWidth();
    const sideH = this.sideSlideHeight();
    const gap = this.slideGap();
    const pad = this.slideBorderPadding();
    const padTotal = pad * 2;

    if (absDiff === 0) {
      return {
        transform: 'translateX(0) scale(1)',
        opacity: '1',
        zIndex: '3',
        width: `${activeW + padTotal}px`,
        height: `${activeH + padTotal}px`,
      };
    }

    if (absDiff === 1) {
      const direction = normalizedDiff > 0 ? 1 : -1;
      const xOffset = direction * ((activeW + padTotal) / 2 + (sideW + padTotal) / 2 + gap);
      return {
        transform: `translateX(${xOffset}px) scale(${sideW / activeW})`,
        opacity: '0.85',
        zIndex: '2',
        width: `${sideW + padTotal}px`,
        height: `${sideH + padTotal}px`,
      };
    }

    const direction = normalizedDiff > 0 ? 1 : -1;
    const xOffset =
      direction * ((activeW + padTotal) / 2 + (sideW + padTotal) / 2 + gap + (sideW / 2 + gap) * (absDiff - 1));
    return {
      transform: `translateX(${xOffset}px) scale(${this.farScale()})`,
      opacity: '0',
      zIndex: '1',
      width: `${sideW + padTotal}px`,
      height: `${sideH + padTotal}px`,
    };
  }
}