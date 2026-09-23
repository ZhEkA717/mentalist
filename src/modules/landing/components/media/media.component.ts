import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
  viewChild,
  viewChildren
} from '@angular/core';
import {isPlatformBrowser, NgOptimizedImage} from '@angular/common';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {CarouselComponent} from '../../components/carousel/carousel.component';
import {SliderItem} from '@modules/landing/models/slider-item';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {initRevealOnScroll} from '../../utils/scroll-animations';

const galleryPhoto = (id: number): SliderItem => ({
  1900: `/assets/images/carousel/${id}-1900.webp`,
  1200: `/assets/images/carousel/${id}-1200.webp`,
  768: `/assets/images/carousel/${id}-768.webp`,
  520: `/assets/images/carousel/${id}-520.webp`,
});

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CarouselComponent, NgOptimizedImage],
  templateUrl: './media.component.html',
  styleUrl: './media.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaSectionComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly isRuDomain = isPlatformBrowser(this.platformId)
    ? (this.activatedRoute.snapshot.queryParams['ru'] || window.location.hostname.endsWith('.ru'))
    : false;
  private readonly el = inject(ElementRef);

  protected videoContainers = viewChildren<ElementRef<HTMLElement>>('videoContainer');
  protected videosSection = viewChild<ElementRef<HTMLElement>>('videosSection');

  private observer: IntersectionObserver | null = null;
  private scrollTriggers: ScrollTrigger[] = [];
  private setTimeoutIds: ReturnType<typeof setTimeout>[] = [];

  protected readonly videoUrls: Array<{youtube: string; vk: string, preview: string, alt: string}> = [
    {
      youtube: 'https://www.youtube.com/embed/sNIPgihatyU?enablejsapi=1&autoplay=1',
      vk: 'https://vkvideo.ru/video_ext.php?oid=-65614643&id=456239035&hash=9ae4ca3a7f22cc57&hd=4&autoplay=1',
      preview: '/assets/images/preview-1.webp',
      alt: 'Внушение сквозь 1000 км'
    },
    {
      youtube: 'https://www.youtube.com/embed/X3jvY2xpmfc?enablejsapi=1&autoplay=1',
      vk: 'https://vkvideo.ru/video_ext.php?oid=-65614643&id=456239034&hash=69a23c2952842a28&hd=4&autoplay=1',
      preview: '/assets/images/preview-2.webp',
      alt: 'Иллюзионно-психологическое шоу на свадьбу'
    },
    {
      youtube: 'https://www.youtube.com/embed/YulDfOQiDk8?enablejsapi=1&autoplay=1',
      vk: 'https://vkvideo.ru/video_ext.php?oid=-65614643&id=456239036&hash=26ddd6f8d47e1ba1&hd=4&autoplay=1',
      preview: '/assets/images/preview-3.webp',
      alt: 'Менталист о мошенниках'
    },
  ];

  protected readonly resolvedVideos: SafeResourceUrl[] = this.videoUrls.map(v =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.isRuDomain ? v.vk : v.youtube),
  );
  protected readonly activeFlags = signal<boolean[]>(this.videoUrls.map(() => false));
  protected readonly loadingFlags = signal<boolean[]>(this.videoUrls.map(() => false));

  protected sliderItems: SliderItem[] = [
    galleryPhoto(1),
    galleryPhoto(2),
    galleryPhoto(3),
    galleryPhoto(4),
    galleryPhoto(5),
    galleryPhoto(6),
    galleryPhoto(7),
    galleryPhoto(8),
    galleryPhoto(9),
    galleryPhoto(10),
    galleryPhoto(11),
    galleryPhoto(12),
    galleryPhoto(13),
    galleryPhoto(14),
    galleryPhoto(15),
    galleryPhoto(16),
    galleryPhoto(17),
    galleryPhoto(18),
    galleryPhoto(19),
    galleryPhoto(20),
    galleryPhoto(21),
    galleryPhoto(22),
    galleryPhoto(23),
    galleryPhoto(24),
    galleryPhoto(26),
    galleryPhoto(27),
  ];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.scrollTriggers.push(...initRevealOnScroll(this.el.nativeElement));
    const id = setTimeout(() => this.initScrollToSecondVideo(), 2200);
    this.setTimeoutIds.push(id);
    this.initVideoObserver();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.setTimeoutIds.forEach(id => clearTimeout(id));
    this.scrollTriggers.forEach(t => t.kill());
    if (isPlatformBrowser(this.platformId)) {
      gsap.killTweensOf(this.el.nativeElement.querySelectorAll('.reveal-on-scroll'));
    }
  }

  private initScrollToSecondVideo(): void {
    const el = this.videosSection()?.nativeElement;
    if (!el) return;

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
    this.activeFlags.update(flags => {
      const next = [...flags];
      next[index] = true;
      return next;
    });
    this.loadingStartedAt.set(index, Date.now());
    this.loadingFlags.update(flags => {
      const next = [...flags];
      next[index] = true;
      return next;
    });
    const id = setTimeout(() => this.clearLoading(index), 8000);
    this.setTimeoutIds.push(id);
  }

  protected onVideoLoaded(index: number): void {
    const started = this.loadingStartedAt.get(index) ?? 0;
    const elapsed = Date.now() - started;
    const remaining = this.MIN_SPINNER_MS - elapsed;
    if (remaining <= 0) {
      this.clearLoading(index);
      return;
    }
    const id = setTimeout(() => this.clearLoading(index), remaining);
    this.setTimeoutIds.push(id);
  }

  private clearLoading(index: number): void {
    this.loadingFlags.update(flags => {
      const next = [...flags];
      next[index] = false;
      return next;
    });
  }

  private initVideoObserver(): void {
    const section = this.videosSection()?.nativeElement;
    if (!section) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            this.pauseVideos();
          }
        }
      },
      { threshold: 0 },
    );
    this.observer.observe(section);
  }

  private pauseVideos(): void {
    const section = this.videosSection()?.nativeElement;
    if (!section) return;

    section.querySelectorAll<HTMLIFrameElement>('iframe').forEach((iframe) => {
      const src = iframe.src;
      const isYouTube = src.includes('youtube.com');

      if (isYouTube) {
        try {
          iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        } catch {}
      } else {
        const index = Number(iframe.getAttribute('data-video-index'));
        if (!Number.isNaN(index)) {
          this.deactivateVideo(index);
        }
      }
    });
  }

  private deactivateVideo(index: number): void {
    this.activeFlags.update(flags => {
      const next = [...flags];
      next[index] = false;
      return next;
    });
    this.clearLoading(index);
    this.loadingStartedAt.delete(index);
  }
}
