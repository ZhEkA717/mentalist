import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

export interface ReviewData {
  review: string;
  name: string;
  photo: string;
  nameSubtitle?: string;
}

export type ReviewCardData =
  | {type: 'review'; value: ReviewData}
  | {type: 'video'; value: string};

const VIDEO_LOADING_TIMEOUT_MS = 8000;
const MIN_SPINNER_MS = 700;

@Component({
  selector: 'app-review-card',
  imports: [],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewCardComponent implements OnInit, OnDestroy {
  data = input.required<ReviewCardData>();
  private readonly sanitizer = inject(DomSanitizer);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  private observer: IntersectionObserver | null = null;
  private loadingStartedAt: number | null = null;
  private spinnerTimer: ReturnType<typeof setTimeout> | null = null;
  private loadingTimer: ReturnType<typeof setTimeout> | null = null;

  protected readonly reviewData = computed<ReviewData | null>(() => {
    const d = this.data();
    return d.type === 'review' ? d.value : null;
  });

  protected readonly isVideo = computed(() => this.data().type === 'video');

  protected readonly isVideoPlaying = signal(false);
  protected readonly isVideoLoading = signal(false);

  protected readonly videoSrc = computed<SafeResourceUrl | null>(() => {
    const d = this.data();
    if (d.type !== 'video') return null;
    const url = this.isVideoPlaying() ? `${d.value}&autoplay=1` : d.value;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.isVideo()) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting && this.isVideoPlaying()) {
            this.deactivateVideo();
          }
        }
      },
      {threshold: 0},
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.clearLoadingTimer();
    this.clearSpinnerTimer();
  }

  protected playVideo(): void {
    if (this.isVideoPlaying()) return;
    this.isVideoPlaying.set(true);
    this.isVideoLoading.set(true);
    this.loadingStartedAt = Date.now();

    if (this.loadingTimer !== null) clearTimeout(this.loadingTimer);
    this.loadingTimer = setTimeout(() => {
      this.deactivateVideo();
    }, VIDEO_LOADING_TIMEOUT_MS);
  }

  protected onVideoLoaded(): void {
    if (this.loadingStartedAt === null) {
      this.isVideoLoading.set(false);
      return;
    }
    const elapsed = Date.now() - this.loadingStartedAt;
    const remaining = MIN_SPINNER_MS - elapsed;
    if (remaining <= 0) {
      this.isVideoLoading.set(false);
      return;
    }
    if (this.spinnerTimer !== null) return;
    this.spinnerTimer = setTimeout(() => {
      this.isVideoLoading.set(false);
      this.spinnerTimer = null;
    }, remaining);
  }

  protected onVideoError(): void {
    this.isVideoLoading.set(false);
  }

  private deactivateVideo(): void {
    this.clearLoadingTimer();
    this.clearSpinnerTimer();
    this.loadingStartedAt = null;
    this.isVideoPlaying.set(false);
    this.isVideoLoading.set(false);
  }

  private clearLoadingTimer(): void {
    if (this.loadingTimer !== null) {
      clearTimeout(this.loadingTimer);
      this.loadingTimer = null;
    }
  }

  private clearSpinnerTimer(): void {
    if (this.spinnerTimer !== null) {
      clearTimeout(this.spinnerTimer);
      this.spinnerTimer = null;
    }
  }
}