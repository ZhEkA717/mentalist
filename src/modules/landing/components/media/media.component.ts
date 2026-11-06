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
  viewChild,
  viewChildren,
} from '@angular/core';
import {isPlatformBrowser, NgOptimizedImage} from '@angular/common';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {BreakpointObserver} from '@angular/cdk/layout';
import {CarouselComponent} from '../../components/carousel/carousel.component';
import {DrawerComponent} from '../drawer/drawer.component';
import {SliderItem} from '@modules/landing/models/slider-item';
import {initRevealOnScroll} from '../../utils/scroll-animations';
import {killGsapTweens, loadGsap} from '../../utils/gsap';
import type {ScrollTrigger} from '../../utils/gsap';
import {createModalClose} from '../../utils/modal-close';
import {environment} from '@environment/environment';

const galleryPhoto = (id: number): SliderItem => ({
  1900: `/assets/images/carousel/${id}-1900.webp`,
  1200: `/assets/images/carousel/${id}-1200.webp`,
  768: `/assets/images/carousel/${id}-768.webp`,
  520: `/assets/images/carousel/${id}-520.webp`,
});

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CarouselComponent, DrawerComponent, NgOptimizedImage],
  templateUrl: './media.component.html',
  styleUrl: './media.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaSectionComponent implements AfterViewInit, OnDestroy {
  background = input<string>('#000000');
  isShowPromo = input<boolean>(true);

  private platformId = inject(PLATFORM_ID);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly isRuDomain = isPlatformBrowser(this.platformId)
    ? (this.activatedRoute.snapshot.queryParams['ru'] || window.location.hostname.endsWith('.ru'))
    : false;
  private readonly isMobileBrowser = isPlatformBrowser(this.platformId)
    ? /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints > 1 && /Macintosh/i.test(navigator.userAgent))
    : false;
  private readonly el = inject(ElementRef);

  protected videoContainers = viewChildren<ElementRef<HTMLElement>>('videoContainer');
  protected videosSection = viewChild<ElementRef<HTMLElement>>('videosSection');

  private observer: IntersectionObserver | null = null;
  private scrollTriggers: ScrollTrigger[] = [];
  private setTimeoutIds: ReturnType<typeof setTimeout>[] = [];
  private activeVideoIndex: number | null = null;
  private loadingTimeoutIds = new Map<number, ReturnType<typeof setTimeout>>();
  private loadingSpinnerTimeoutIds = new Map<number, ReturnType<typeof setTimeout>>();
  private scrollLocked = false;
  private previousDocumentOverflow = '';
  private previousBodyOverflow = '';
  private previousBodyTouchAction = '';

  protected readonly videoUrls: Array<{youtube: string; vk: string, preview: string, alt: string}> = [
    {
      youtube: 'https://www.youtube.com/embed/sNIPgihatyU?enablejsapi=1&autoplay=1&playsinline=1',
      vk: 'https://vkvideo.ru/video_ext.php?oid=-65614643&id=456239035&hash=9ae4ca3a7f22cc57&hd=4&autoplay=1&playsinline=1',
      preview: '/assets/images/preview-1.webp',
      alt: 'Внушение сквозь 1000 км'
    },
    {
      youtube: 'https://www.youtube.com/embed/X3jvY2xpmfc?enablejsapi=1&autoplay=1&playsinline=1',
      vk: 'https://vkvideo.ru/video_ext.php?oid=-65614643&id=456239034&hash=69a23c2952842a28&hd=4&autoplay=1&playsinline=1',
      preview: '/assets/images/preview-2.webp',
      alt: 'Иллюзионно-психологическое шоу на свадьбу'
    },
    {
      youtube: 'https://www.youtube.com/embed/YulDfOQiDk8?enablejsapi=1&autoplay=1&playsinline=1',
      vk: 'https://vkvideo.ru/video_ext.php?oid=-65614643&id=456239036&hash=26ddd6f8d47e1ba1&hd=4&autoplay=1&playsinline=1',
      preview: '/assets/images/preview-3.webp',
      alt: 'Менталист о мошенниках'
    },
  ];

  protected readonly resolvedVideos: SafeResourceUrl[] = this.videoUrls.map(v => {
    const source = this.isRuDomain ? v.vk : v.youtube;
    const mobileAutoplayParams = this.isMobileBrowser ? '&mute=1&muted=1' : '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(source + mobileAutoplayParams);
  });
  protected readonly activeFlags = signal<boolean[]>(this.videoUrls.map(() => false));
  protected readonly loadingFlags = signal<boolean[]>(this.videoUrls.map(() => false));

  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly isMobile = signal(false);

  private readonly VIDEO_URL = 'https://vk.com/video_ext.php?oid=-65614643&id=456239031&autoplay=1';
  private readonly blankUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
  protected videoUrl: SafeResourceUrl = this.blankUrl;
  protected videoOpen = signal(false);
  protected videoLoading = signal(false);
  private promoLoadingStartedAt = 0;
  private videoLoadPending = false;

  private readonly videoModal = createModalClose({lockScroll: true});
  protected videoClosing = this.videoModal.closing;
  protected videoRendered = this.videoModal.rendered;

  protected sliderItems: SliderItem[] = [
    ...Array.from({length: 24}, (_, i) => galleryPhoto(i + 1)),
    galleryPhoto(26),
    galleryPhoto(27),
  ];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    void initRevealOnScroll(this.el.nativeElement).then(triggers => {
      this.scrollTriggers.push(...triggers);
    });
    const id = setTimeout(() => this.initScrollToSecondVideo(), 2200);
    this.setTimeoutIds.push(id);
    this.initVideoObserver();

    const sub = this.breakpointObserver.observe('(max-width: 950px)').subscribe(result => {
      this.isMobile.set(result.matches);
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  ngOnDestroy(): void {
    this.videoModal.destroy();
    this.observer?.disconnect();
    this.setTimeoutIds.forEach(id => clearTimeout(id));
    this.loadingTimeoutIds.forEach(id => clearTimeout(id));
    this.loadingSpinnerTimeoutIds.forEach(id => clearTimeout(id));
    this.scrollTriggers.forEach(t => t.kill());
    if (isPlatformBrowser(this.platformId)) {
      this.unlockScroll();
      killGsapTweens(this.el.nativeElement.querySelectorAll('.reveal-on-scroll'));
    }
  }

  private async initScrollToSecondVideo(): Promise<void> {
    const el = this.videosSection()?.nativeElement;
    if (!el) return;

    const {ScrollTrigger} = await loadGsap();
    let triggered = false;

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 100%',
      onEnter: () => {
        if (triggered) return;
        triggered = true;
        this.scrollToSecondVideo();
      },
    });
    this.scrollTriggers.push(st);
  }

  private scrollToSecondVideo(): void {
    const containers = this.videoContainers();
    if (containers.length < 2) return;
    const el = containers[1].nativeElement;
    const parent = el.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const childRect = el.getBoundingClientRect();
    const offset = parent.scrollLeft + childRect.left - parentRect.left - parent.clientWidth / 2 + childRect.width / 2;
    parent.scrollTo({ left: Math.max(0, offset), behavior: 'smooth'});
  }

  private readonly MIN_SPINNER_MS = 700;
  private readonly loadingStartedAt = new Map<number, number>();

  protected activateVideo(index: number): void {
    if (
      index < 0 ||
      index >= this.videoUrls.length ||
      this.activeVideoIndex === index
    ) return;

    if (this.activeVideoIndex !== null) {
      this.deactivateVideo(this.activeVideoIndex);
    }

    this.activeVideoIndex = index;
    this.lockScroll();
    this.loadingStartedAt.set(index, Date.now());
    this.activeFlags.set(this.videoUrls.map((_, videoIndex) => videoIndex === index));
    this.loadingFlags.set(this.videoUrls.map((_, videoIndex) => videoIndex === index));

    const id = setTimeout(() => this.clearLoading(index), 8000);
    this.loadingTimeoutIds.set(index, id);
    this.setTimeoutIds.push(id);
  }

  protected onVideoLoaded(index: number, iframe: HTMLIFrameElement): void {
    if (
      this.getVideoIframe(index) !== iframe ||
      this.activeVideoIndex !== index ||
      !this.loadingFlags()[index]
    ) return;

    this.requestVideoPlayback(index);
    const started = this.loadingStartedAt.get(index) ?? 0;
    const elapsed = Date.now() - started;
    const remaining = this.MIN_SPINNER_MS - elapsed;
    if (remaining <= 0) {
      this.clearLoading(index);
      return;
    }
    if (this.loadingSpinnerTimeoutIds.has(index)) return;
    const id = setTimeout(() => this.clearLoading(index), remaining);
    this.loadingSpinnerTimeoutIds.set(index, id);
    this.setTimeoutIds.push(id);
  }

  protected onVideoError(index: number, iframe: HTMLIFrameElement): void {
    if (this.getVideoIframe(index) !== iframe || this.activeVideoIndex !== index) return;
    this.clearLoading(index);
  }

  private clearLoading(index: number): void {
    if (this.activeVideoIndex !== index || !this.loadingFlags()[index]) return;

    const timeoutId = this.loadingTimeoutIds.get(index);
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      this.loadingTimeoutIds.delete(index);
    }
    const spinnerTimeoutId = this.loadingSpinnerTimeoutIds.get(index);
    if (spinnerTimeoutId !== undefined) {
      clearTimeout(spinnerTimeoutId);
      this.loadingSpinnerTimeoutIds.delete(index);
    }
    this.loadingStartedAt.delete(index);
    this.loadingFlags.update(flags => {
      const next = [...flags];
      next[index] = false;
      return next;
    });
    this.unlockScroll();
  }

  private initVideoObserver(): void {
    const containers = this.videoContainers();
    if (!containers.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset['videoIndex']);
          if (!Number.isNaN(index)) {
            this.pauseVideoAtIndex(index);
          }
        }
      },
      { threshold: 0 },
    );
    containers.forEach(container => observer.observe(container.nativeElement));
    this.observer = observer;
  }

  private pauseVideoAtIndex(index: number): void {
    if (this.activeVideoIndex !== index) return;

    const iframe = this.getVideoIframe(index);
    if (!iframe) return;

    if (this.loadingFlags()[index]) {
      this.deactivateVideo(index);
      return;
    }

    if (iframe.src.includes('youtube.com')) {
      this.postYouTubeCommand(iframe, 'pauseVideo');
    } else {
      this.deactivateVideo(index);
    }
  }

  private deactivateVideo(index: number): void {
    if (this.activeVideoIndex !== index) return;

    this.pauseVideo(index);
    const timeoutId = this.loadingTimeoutIds.get(index);
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      this.loadingTimeoutIds.delete(index);
    }
    const spinnerTimeoutId = this.loadingSpinnerTimeoutIds.get(index);
    if (spinnerTimeoutId !== undefined) {
      clearTimeout(spinnerTimeoutId);
      this.loadingSpinnerTimeoutIds.delete(index);
    }
    this.loadingStartedAt.delete(index);
    this.activeFlags.set(this.videoUrls.map(() => false));
    this.loadingFlags.set(this.videoUrls.map(() => false));
    this.activeVideoIndex = null;
    this.unlockScroll();
  }

  private requestVideoPlayback(index: number): void {
    const iframe = this.getVideoIframe(index);
    if (!iframe || !iframe.src.includes('youtube.com')) return;
    this.postYouTubeCommand(iframe, 'playVideo');
  }

  private pauseVideo(index: number): void {
    const iframe = this.getVideoIframe(index);
    if (!iframe || !iframe.src.includes('youtube.com')) return;
    this.postYouTubeCommand(iframe, 'pauseVideo');
  }

  private postYouTubeCommand(iframe: HTMLIFrameElement, func: 'playVideo' | 'pauseVideo'): void {
    try {
      iframe.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func, args: '' }),
        '*',
      );
    } catch {}
  }

  private getVideoIframe(index: number): HTMLIFrameElement | null {
    if (index < 0 || index >= this.videoUrls.length) return null;
    return this.videosSection()?.nativeElement.querySelector<HTMLIFrameElement>(
      `iframe[data-video-index="${index}"]`,
    ) ?? null;
  }

  private lockScroll(): void {
    if (
      this.scrollLocked ||
      !isPlatformBrowser(this.platformId) ||
      typeof document === 'undefined'
    ) return;

    const body = document.body;
    if (!body) return;

    this.previousDocumentOverflow = document.documentElement.style.overflow;
    this.previousBodyOverflow = body.style.overflow;
    this.previousBodyTouchAction = body.style.touchAction;
    document.documentElement.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.touchAction = 'none';
    this.scrollLocked = true;
  }

  private unlockScroll(): void {
    if (!this.scrollLocked || !isPlatformBrowser(this.platformId) || typeof document === 'undefined') return;

    const body = document.body;
    if (body) {
      body.style.overflow = this.previousBodyOverflow;
      body.style.touchAction = this.previousBodyTouchAction;
    }
    document.documentElement.style.overflow = this.previousDocumentOverflow;
    this.scrollLocked = false;
  }

  protected openVideo(): void {
    if (this.videoLoadPending) return;
    this.videoLoadPending = true;
    this.promoLoadingStartedAt = Date.now();
    this.videoLoading.set(true);
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.VIDEO_URL);
    const id = setTimeout(() => this.finishVideoOpen(), 8000);
    this.setTimeoutIds.push(id);
  }

  protected onModalVideoLoaded(): void {
    if (!this.videoLoadPending) return;
    const elapsed = Date.now() - this.promoLoadingStartedAt;
    const remaining = this.MIN_SPINNER_MS - elapsed;
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
  }

  private clearVideoSource(): void {
    this.videoUrl = this.blankUrl;
  }

  protected readonly environment = environment;
}
