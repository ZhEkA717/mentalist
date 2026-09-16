import {ChangeDetectionStrategy, Component, effect, HostListener, input, model, signal} from '@angular/core';

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

  protected closing = signal(false);

  constructor() {
    effect(() => {
      if (this.galleryOpen()) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
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
    this.closing.set(true);
    setTimeout(() => {
      this.galleryOpen.set(false);
      this.closing.set(false);
      document.body.classList.remove('no-scroll');
    }, 400);
  }

  protected galleryPrev(): void {
    this.galleryIndex.set((this.galleryIndex() - 1 + this.totalSlides) % this.totalSlides);
  }

  protected galleryNext(): void {
    this.galleryIndex.set((this.galleryIndex() + 1) % this.totalSlides);
  }

  private handleTouchStartY = 0;

  protected onHandleTouchStart(event: TouchEvent): void {
    this.handleTouchStartY = event.touches[0].clientY;
  }

  protected onHandleTouchMove(event: TouchEvent): void {
    event.preventDefault();
    const deltaY = this.handleTouchStartY - event.touches[0].clientY;
    if (deltaY > 80) {
      this.handleTouchStartY = 0;
      this.closeGallery();
    }
  }

  protected onHandleTouchEnd(): void {
    this.handleTouchStartY = 0;
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
