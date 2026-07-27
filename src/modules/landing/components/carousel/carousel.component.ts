import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {GalleryComponent} from '../gallery/gallery.component';

@Component({
  selector: 'app-carousel',
  imports: [
    GalleryComponent
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselComponent {
  sliderItems = input<string[]>([]);
  protected currentSlideIndex = 0;

  galleryOpen = false;
  galleryIndex = 0;

  protected openGallery(index: number): void {
    this.galleryIndex = index;
    this.galleryOpen = true;
  }

  protected get totalSlides(): number {
    return this.sliderItems().length;
  }
  protected prevSlide(): void {
    this.currentSlideIndex =
      (this.currentSlideIndex - 1 + this.totalSlides) % this.totalSlides;
  }

  protected nextSlide(): void {
    this.currentSlideIndex =
      (this.currentSlideIndex + 1) % this.totalSlides;
  }

  protected goToSlide(index: number): void {
    this.currentSlideIndex = index;
  }

  protected getSliderStyle(index: number): Record<string, string> {
    const diff = index - this.currentSlideIndex;
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
