import {AfterViewInit, Component, ElementRef, inject, OnDestroy, signal} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {initRevealOnScroll, initDimOnScroll} from '../../utils/scroll-animations';

@Component({
  selector: 'app-promo-show',
  standalone: true,
  templateUrl: './promo-show.component.html',
  styleUrls: ['./promo-show.component.scss']
})
export class PromoShowSectionComponent implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly sanitizer = inject(DomSanitizer);

  protected videoOpen = signal(false);
  protected videoUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://vk.com/video_ext.php?oid=-65614643&id=456239031'
  );

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
  }

  protected openVideo(): void {
    this.videoOpen.set(true);
  }

  protected closeVideo(): void {
    this.videoOpen.set(false);
  }

  ngOnDestroy(): void {
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
