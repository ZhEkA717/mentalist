import {AfterViewInit, Component, DestroyRef, ElementRef, inject, OnDestroy, signal, viewChild, viewChildren} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {BreakpointObserver} from '@angular/cdk/layout';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {initDimOnScroll, initRevealOnScroll} from '../../utils/scroll-animations';
import {createModalClose} from '../../utils/modal-close';
import {DrawerComponent} from '../drawer/drawer.component';

@Component({
  selector: 'app-promo-show',
  standalone: true,
  imports: [DrawerComponent],
  templateUrl: './promo-show.component.html',
  styleUrls: ['./promo-show.component.scss']
})
export class PromoShowSectionComponent implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);

  protected videoContainers = viewChildren<ElementRef<HTMLElement>>('videoContainer');
  protected videosSection = viewChild<ElementRef<HTMLElement>>('videosSection');
  protected cardsContainer = viewChild<ElementRef<HTMLElement>>('cardsContainer');
  protected videoOpen = signal(false);
  private readonly VIDEO_URL = 'https://vk.com/video_ext.php?oid=-65614643&id=456239031&autoplay=1';
  protected videoUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.VIDEO_URL);
  private readonly blankUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');

  protected readonly isMobile = signal(false);
  private readonly videoModal = createModalClose({lockScroll: true});
  videoClosing = this.videoModal.closing;
  videoRendered = this.videoModal.rendered;

  protected cards = [
    {
      id: 1,
      img: 'assets/images/card_1.webp',
      title: 'Корпоративные мероприятия',
      description: 'Современное шоу для корпоративных мероприятий, компаний, деловых встреч, презентаций и специальных событий.'
    },
    {
      id: 2,
      img: 'assets/images/card_2.webp',
      title: 'Свадьбы',
      description: 'Эмоциональное шоу, которое объединяет гостей, вовлекает молодоженов и делает свадебное событие по-настоящему запоминающимся.'
    },
    {
      id: 3,
      img: 'assets/images/card_3.webp',
      title: 'Частные мероприятия',
      description: 'Формат для дней рождения, юбилеев, закрытых вечеров, семейных праздников и других частных событий.'
    },
  ];

  ngAfterViewInit(): void {
    const container = this.el.nativeElement;
    initRevealOnScroll(container);
    initDimOnScroll(container);
    setTimeout(() => this.initCardFlip(), 2200);

    const sub = this.breakpointObserver.observe('(max-width: 950px)').subscribe(result => {
      this.isMobile.set(result.matches);
      if (result.matches) {
        setTimeout(() => this.scrollToMiddleCard(), 100);
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  protected openVideo(): void {
    if (this.isMobile()) {
      this.videoOpen.set(true);
    } else {
      this.videoModal.prepareOpen();
      this.videoOpen.set(true);
    }
  }

  protected closeVideo(): void {
    this.videoUrl = this.blankUrl;
    if (this.isMobile()) {
      this.videoOpen.set(false);
    } else {
      this.videoModal.close(() => {
        this.videoOpen.set(false);
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.VIDEO_URL);
      });
    }
  }

  protected onDrawerClosed(): void {
    this.videoOpen.set(false);
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.VIDEO_URL);
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
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.killTweensOf(this.el.nativeElement.querySelectorAll('.reveal-on-scroll, .dim-on-scroll'));
  }

  private initCardFlip(): void {
    gsap.utils.toArray<HTMLElement>('.show__content__item', this.el.nativeElement).forEach((card) => {
      const inner = card.querySelector('.card-inner') as HTMLElement;
      if (!inner) return;

      gsap.set(inner, {rotateY: 180});

      ScrollTrigger.create({
        trigger: card,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => gsap.to(inner, {rotateY: 0, duration: 0.8, ease: 'power2.inOut'}),
        onLeave: () => gsap.to(inner, {rotateY: 180, duration: 0.8, ease: 'power2.inOut'}),
        onEnterBack: () => gsap.to(inner, {rotateY: 0, duration: 0.8, ease: 'power2.inOut'}),
        onLeaveBack: () => gsap.to(inner, {rotateY: 180, duration: 0.8, ease: 'power2.inOut'}),
      });
    });
  }
}
