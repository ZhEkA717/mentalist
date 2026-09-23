import {ChangeDetectionStrategy, Component, input, OnDestroy, signal} from '@angular/core';
import {GalleryComponent} from '../gallery/gallery.component';
import {MediaIndicatorsComponent} from '@modules/landing/components/media-indicators/media-indicators.component';
import {sliderPictureSources, SliderItem} from '@modules/landing/models/slider-item';

@Component({
  selector: 'app-carousel',
  imports: [
    GalleryComponent,
    MediaIndicatorsComponent
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselComponent implements OnDestroy {
  sliderItems = input<SliderItem[]>([]);
  protected currentSlideIndex = signal(0);

  private readonly transitionMs = 500;
  private animating = false;
  private animTimer: ReturnType<typeof setTimeout> | null = null;

  private touchStartX = 0;
  private touchStartY = 0;
  private blockedClick = false;
  galleryOpen = signal(false);
  galleryIndex = signal(0);

  protected openGallery(index: number): void {
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

  protected readonly sliderPictureSources = sliderPictureSources;
  protected get totalSlides(): number {
    return this.sliderItems().length;
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

    if (absDiff === 0) {
      return {
        transform: `translateX(0) scale(1)`,
        opacity: '1',
        zIndex: '3',
        width: '425px',
        height: '283px',
      };
    }

    if (absDiff === 1) {
      const direction = normalizedDiff > 0 ? 1 : -1;
      const xOffset = direction * (425 / 2 + 244 / 2 + 16);
      return {
        transform: `translateX(${xOffset}px) scale(${244 / 425})`,
        opacity: '0.85',
        zIndex: '2',
        width: '244px',
        height: '163px',
      };
    }

    const direction = normalizedDiff > 0 ? 1 : -1;
    const xOffset =
      direction * ((425 / 2 + 244 / 2 + 16) + (244 / 2 + 16) * (absDiff - 1));
    return {
      transform: `translateX(${xOffset}px) scale(0.6)`,
      opacity: '0',
      zIndex: '1',
      width: '244px',
      height: '163px',
    };
  }
}
