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
  signal,
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {BreakpointObserver} from '@angular/cdk/layout';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {
  ReviewCardComponent,
  ReviewCardData,
} from '../review-card/review-card.component';
import {CarouselComponent} from '../carousel/carousel.component';
import {DrawerComponent} from '../drawer/drawer.component';
import {initRevealOnScroll} from '../../utils/scroll-animations';
import {killGsapTweens} from '../../utils/gsap';
import {createModalClose} from '../../utils/modal-close';
import type {ScrollTrigger} from '../../utils/gsap';

const VIDEO_LOADING_TIMEOUT_MS = 8000;
const MIN_SPINNER_MS = 700;

@Component({
  selector: 'app-reviews-section',
  imports: [CarouselComponent, ReviewCardComponent, DrawerComponent],
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
  private readonly sanitizer = inject(DomSanitizer);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly videoModal = createModalClose({lockScroll: true});

  protected readonly isMobile = signal(false);
  protected readonly videoOpen = signal(false);
  protected readonly videoLoading = signal(false);
  protected readonly loadingVideoUrl = signal<string | null>(null);
  protected readonly videoClosing = this.videoModal.closing;
  protected readonly videoRendered = this.videoModal.rendered;

  private readonly blankUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
  protected videoUrl: SafeResourceUrl = this.blankUrl;

  private loadingStartedAt = 0;
  private videoLoadPending = false;
  private setTimeoutIds: ReturnType<typeof setTimeout>[] = [];
  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    void initRevealOnScroll(this.el.nativeElement).then((triggers) => {
      this.triggers.push(...triggers);
    });
    const sub = this.breakpointObserver.observe('(max-width: 950px)').subscribe((result) => {
      this.isMobile.set(result.matches);
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  ngOnDestroy(): void {
    this.triggers.forEach((t) => t.kill());
    this.videoModal.destroy();
    this.setTimeoutIds.forEach((id) => clearTimeout(id));
    if (isPlatformBrowser(this.platformId)) {
      killGsapTweens(this.el.nativeElement.querySelectorAll('.reveal-on-scroll'));
    }
  }

  protected isVideoLoading(item: unknown): boolean {
    if (!item || typeof item !== 'object') return false;
    const d = item as ReviewCardData;
    if (d.type !== 'video') return false;
    return this.loadingVideoUrl() === d.value;
  }

  protected onVideoOpen(url: string): void {
    if (this.videoLoadPending) return;
    this.videoLoadPending = true;
    this.loadingStartedAt = Date.now();
    this.videoLoading.set(true);
    this.loadingVideoUrl.set(url);
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${url}&autoplay=1`);
    const id = setTimeout(() => this.finishVideoOpen(), VIDEO_LOADING_TIMEOUT_MS);
    this.setTimeoutIds.push(id);
  }

  protected onVideoLoaded(): void {
    if (!this.videoLoadPending) return;
    const elapsed = Date.now() - this.loadingStartedAt;
    const remaining = MIN_SPINNER_MS - elapsed;
    if (remaining <= 0) {
      this.finishVideoOpen();
      return;
    }
    const id = setTimeout(() => this.finishVideoOpen(), remaining);
    this.setTimeoutIds.push(id);
  }

  private finishVideoOpen(): void {
    if (!this.videoLoadPending) return;
    this.videoLoadPending = false;
    this.videoLoading.set(false);
    if (this.isMobile()) {
      this.videoOpen.set(true);
    } else {
      this.videoModal.prepareOpen();
      this.videoOpen.set(true);
    }
  }

  protected closeVideo(): void {
    this.stopVideo();
    if (this.isMobile()) {
      this.videoOpen.set(false);
      this.clearVideoSource();
    } else {
      this.videoModal.close(() => {
        this.videoOpen.set(false);
        this.clearVideoSource();
      });
    }
  }

  protected onDrawerClosingStart(): void {
    this.stopVideo();
  }

  protected onDrawerClosed(): void {
    this.videoOpen.set(false);
    this.stopVideo();
    this.clearVideoSource();
  }

  private stopVideo(): void {
    this.videoLoadPending = false;
    this.videoLoading.set(false);
    this.loadingVideoUrl.set(null);
  }

  private clearVideoSource(): void {
    this.videoUrl = this.blankUrl;
  }
}
