import {ChangeDetectionStrategy, Component, DestroyRef, effect, HostListener, inject, input, model, OnDestroy, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {BreakpointObserver} from '@angular/cdk/layout';
import {DrawerComponent} from '../drawer/drawer.component';
import {createModalClose} from '../../utils/modal-close';
import {sliderSrcset, SliderItem} from '@modules/landing/models/slider-item';

@Component({
  selector: 'app-gallery',
  imports: [DrawerComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryComponent implements OnDestroy {
  private platformId = inject(PLATFORM_ID);
  public galleryOpen = model<boolean>(false);
  public galleryIndex = model<number>(0);
  sliderItems = input<SliderItem[]>([]);
  protected readonly sliderSrcset = sliderSrcset;

  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isMobile = signal(false);
  protected readonly desktopModal = createModalClose({lockScroll: true});
  protected readonly closing = this.desktopModal.closing;
  protected readonly rendered = this.desktopModal.rendered;

  private touchStartX = 0;
  private touchStartY = 0;
  private blockedClick = false;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const sub = this.breakpointObserver.observe('(max-width: 950px)').subscribe(result => {
        this.isMobile.set(result.matches);
      });
      this.destroyRef.onDestroy(() => sub.unsubscribe());
    }

    effect(() => {
      if (this.galleryOpen() && !this.isMobile()) {
        this.desktopModal.prepareOpen();
      }
    });
  }

  protected get totalSlides(): number {
    return this.sliderItems().length;
  }

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
    if (this.isMobile()) {
      this.galleryOpen.set(false);
    } else {
      this.desktopModal.close(() => {
        this.galleryOpen.set(false);
      });
    }
  }

  protected onDrawerClosed(): void {
    this.galleryOpen.set(false);
  }

  protected galleryPrev(): void {
    this.galleryIndex.set((this.galleryIndex() - 1 + this.totalSlides) % this.totalSlides);
  }

  protected galleryNext(): void {
    this.galleryIndex.set((this.galleryIndex() + 1) % this.totalSlides);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
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

  ngOnDestroy(): void {
    this.desktopModal.destroy();
  }
}
