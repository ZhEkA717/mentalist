import {ChangeDetectionStrategy, Component, effect, HostListener, input, model} from '@angular/core';

@Component({
  selector: 'app-gallery',
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryComponent {
  public galleryOpen = model<boolean>(false);
  public galleryIndex = model<number>(0);
  sliderItems = input<string[]>([]);

  constructor() {
    effect(() => {
      document.body.style.overflow = this.galleryOpen() ? 'hidden' : '';
    });
  }

  protected get totalSlides(): number {
    return this.sliderItems().length;
  }

  private touchStartX = 0;
  private touchStartY = 0;
  private blockedClick = false;

  protected onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  protected onTouchEnd(event: TouchEvent): void {
    const dx = event.changedTouches[0].clientX - this.touchStartX;
    const dy = event.changedTouches[0].clientY - this.touchStartY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      this.blockedClick = true;
      if (dx < 0) this.galleryNext();
      else this.galleryPrev();
      setTimeout(() => (this.blockedClick = false), 60);
    }
  }

  protected closeGallery(): void {
    if (this.blockedClick) {
      this.blockedClick = false;
      return;
    }
    this.galleryOpen.set(false);
    document.body.style.overflow = '';
  }

  protected galleryPrev(): void {
    this.galleryIndex.set((this.galleryIndex() - 1 + this.totalSlides) % this.totalSlides);

  }

  protected galleryNext(): void {
    this.galleryIndex.set((this.galleryIndex() + 1) % this.totalSlides);

  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.galleryOpen) return;
    switch (event.key) {
      case 'Escape':
        this.closeGallery();
        break;
      case 'ArrowLeft':
        this.galleryPrev();
        break;
      case 'ArrowRight':
        this.galleryNext();
        break;
    }
  }
}
