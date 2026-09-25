import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
  viewChild
} from '@angular/core';
import {isPlatformBrowser, NgOptimizedImage} from '@angular/common';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {BreakpointObserver} from '@angular/cdk/layout';
import {initDimOnScroll, initRevealOnScroll} from '../../utils/scroll-animations';
import type {ScrollTrigger} from '../../utils/gsap';
import {killGsapTweens, loadGsap} from '../../utils/gsap';
import {createModalClose} from '../../utils/modal-close';
import {DrawerComponent} from '../drawer/drawer.component';

@Component({
  selector: 'app-promo-show',
  standalone: true,
  imports: [DrawerComponent, NgOptimizedImage],
  templateUrl: './promo-show.component.html',
  styleUrls: ['./promo-show.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoShowSectionComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private readonly el = inject(ElementRef);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);
  private scrollTriggers: ScrollTrigger[] = [];
  private setTimeoutIds: ReturnType<typeof setTimeout>[] = [];
  protected cardsContainer = viewChild<ElementRef<HTMLElement>>('cardsContainer');
  protected videoOpen = signal(false);
  private readonly blankUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
  private readonly VIDEO_URL = 'https://vk.com/video_ext.php?oid=-65614643&id=456239031&autoplay=1';
  protected videoUrl: SafeResourceUrl = this.blankUrl;
  protected videoLoading = signal(false);
  private readonly MIN_SPINNER_MS = 700;
  private loadingStartedAt = 0;
  private videoLoadPending = false;

  protected readonly isMobile = signal(false);
  private readonly videoModal = createModalClose({lockScroll: true});
  videoClosing = this.videoModal.closing;
  videoRendered = this.videoModal.rendered;

  protected cards = [
    {
      id: 1,
      img: '/assets/images/card_1.webp',
      imgSmall: '/assets/images/card_1-274x285.webp',
      title: 'Корпоративные мероприятия',
      description: 'Современное шоу для корпоративных мероприятий, компаний, деловых встреч, презентаций и специальных событий.'
    },
    {
      id: 2,
      img: '/assets/images/card_2.webp',
      imgSmall: '/assets/images/card_2-274x284.webp',
      title: 'Свадьбы',
      description: 'Эмоциональное шоу, которое объединяет гостей, вовлекает молодоженов и делает свадебное событие по-настоящему запоминающимся.'
    },
    {
      id: 3,
      img: '/assets/images/card_3.webp',
      imgSmall: '/assets/images/card_3-274x311.webp',
      title: 'Частные мероприятия',
      description: 'Формат для дней рождения, юбилеев, закрытых вечеров, семейных праздников и других частных событий.'
    },
  ];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const container = this.el.nativeElement;
    void initRevealOnScroll(container).then(triggers => {
      this.scrollTriggers.push(...triggers);
    });
    void initDimOnScroll(container).then(triggers => {
      this.scrollTriggers.push(...triggers);
    });
    const id = setTimeout(() => this.initCardFlip(), 2200);
    this.setTimeoutIds.push(id);

    const sub = this.breakpointObserver.observe('(max-width: 950px)').subscribe(result => {
      this.isMobile.set(result.matches);
      if (result.matches) {
        const id2 = setTimeout(() => this.scrollToMiddleCard(), 100);
        this.setTimeoutIds.push(id2);
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  protected openVideo(): void {
    if (this.videoLoadPending) return;
    this.videoLoadPending = true;
    this.loadingStartedAt = Date.now();
    this.videoLoading.set(true);
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.VIDEO_URL);
    const id = setTimeout(() => this.finishVideoOpen(), 8000);
    this.setTimeoutIds.push(id);
  }

  protected onVideoLoaded(): void {
    if (!this.videoLoadPending) return;
    const elapsed = Date.now() - this.loadingStartedAt;
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

  private scrollToMiddleCard(): void {
    const container = this.cardsContainer()?.nativeElement;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>('.show__content__item');
    if (cards.length < 2) return;
    const middleCard = cards[1];
    const scrollTarget = middleCard.offsetLeft - (container.clientWidth / 2) + (middleCard.offsetWidth / 2);
    container.scrollTo({ left: scrollTarget, behavior: 'auto' });
  }

  ngOnDestroy(): void {
    this.videoModal.destroy();
    this.setTimeoutIds.forEach(id => clearTimeout(id));
    this.scrollTriggers.forEach(t => t.kill());
    if (isPlatformBrowser(this.platformId)) {
      killGsapTweens(this.el.nativeElement.querySelectorAll('.reveal-on-scroll, .dim-on-scroll'));
    }
  }

  private async initCardFlip(): Promise<void> {
    const {gsap, ScrollTrigger} = await loadGsap();
    gsap.utils.toArray<HTMLElement>('.show__content__item', this.el.nativeElement).forEach((card) => {
      const inner = card.querySelector('.card-inner') as HTMLElement;
      if (!inner) return;

      gsap.set(inner, {rotateY: 180});

      const st = ScrollTrigger.create({
        trigger: card,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => gsap.to(inner, {rotateY: 0, duration: 0.8, ease: 'power2.inOut'}),
        onLeave: () => gsap.to(inner, {rotateY: 180, duration: 0.8, ease: 'power2.inOut'}),
        onEnterBack: () => gsap.to(inner, {rotateY: 0, duration: 0.8, ease: 'power2.inOut'}),
        onLeaveBack: () => gsap.to(inner, {rotateY: 180, duration: 0.8, ease: 'power2.inOut'}),
      });
      this.scrollTriggers.push(st);
    });
  }
}
