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

  protected closeGallery(): void {
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
