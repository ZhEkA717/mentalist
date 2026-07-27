import { Component, OnDestroy, AfterViewInit, DestroyRef, inject } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SUBTITLE_TEXT = 'Менталист • Психологический иллюзионист • дипломированный психолог • гипнотизёр';
const SCRAMBLE_CHARS = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ абвгдежзиклмнопрстуфхцчшщэюя';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  private timers: ReturnType<typeof setTimeout | typeof setInterval>[] = [];
  private styleObserver: MutationObserver | null = null;
  private booted = false;

  protected subtitleText = SUBTITLE_TEXT;

  protected items: { label: string; href: string }[] = [
    { label: 'Главная', href: '#hero' },
    { label: 'Выступления', href: '#about-show' },
    { label: 'Авторские шоу', href: '#shows' },
    { label: 'Лекции', href: '#about' },
    { label: 'Об александре', href: '#contact' },
    { label: 'Медиа', href: '#contact' },
    { label: 'Контакты', href: '#contact' },
  ];

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

  protected ribbonItems = [
    {
      id: 1,
      icon: 'assets/images/image_1.png',
      description: 'Самый титулованный \n' +
        'менталист СНГ'
    },
    {
      id: 2,
      icon: 'assets/images/image_2.png',
      description: '15+ лет \n' +
        'на сцене'
    },
    {
      id: 3,
      icon: 'assets/images/image_3.png',
      description: 'Создатель авторских \n' +
        'шоу и эффектов'
    },
    {
      id: 4,
      icon: 'assets/images/image_4.png',
      description: 'Консультант\n' +
        'ТВ-проектов'
    },
    {
      id: 5,
      icon: 'assets/images/image_5.png',
      description: 'Дипломированный \n' +
        'психолог'
    },
    {
      id: 6,
      icon: 'assets/images/image_6.png',
      description: 'Спикер международных\n' +
        'фестивалей'
    }
  ]

  protected sliderItems = [
    'assets/images/IMG_1.png',
    'assets/images/IMG_2.png',
    'assets/images/IMG_3.png',
    'assets/images/IMG_4.png',
    'assets/images/IMG_5.png',
    'assets/images/IMG_6.png',
    'assets/images/IMG_7.png',
    'assets/images/IMG_8.png',
    'assets/images/IMG_9.png',
    'assets/images/IMG_10.png',
    'assets/images/IMG_11.png',
    'assets/images/IMG_12.png',
    'assets/images/IMG_13.png',
    'assets/images/IMG_14.png',
    'assets/images/IMG_15.png',
    'assets/images/IMG_16.png',
  ];

  protected currentSlideIndex = 0;

  protected get totalSlides(): number {
    return this.sliderItems.length;
  }

  protected prevSlide(): void {
    this.currentSlideIndex =
      (this.currentSlideIndex - 1 + this.totalSlides) % this.totalSlides;
  }

  protected nextSlide(): void {
    this.currentSlideIndex =
      (this.currentSlideIndex + 1) % this.totalSlides;
  }

  protected goToSlide(index: number): void {
    this.currentSlideIndex = index;
  }

  protected getSliderStyle(index: number): Record<string, string> {
    const diff = index - this.currentSlideIndex;
    const total = this.totalSlides;

    let normalizedDiff = diff;
    if (diff > total / 2) normalizedDiff = diff - total;
    if (diff < -total / 2) normalizedDiff = diff + total;

    const absDiff = Math.abs(normalizedDiff);

    if (absDiff === 0) {
      return {
        transform: `translateX(0) scale(1)`,
        opacity: '1',
        zIndex: '3',
        width: '425px',
        height: '283px',
      };
    }

    if (absDiff === 1) {
      const direction = normalizedDiff > 0 ? 1 : -1;
      const xOffset = direction * (425 / 2 + 244 / 2 + 16);
      return {
        transform: `translateX(${xOffset}px) scale(${244 / 425})`,
        opacity: '0.85',
        zIndex: '2',
        width: '244px',
        height: '163px',
      };
    }

    const direction = normalizedDiff > 0 ? 1 : -1;
    const xOffset =
      direction * ((425 / 2 + 244 / 2 + 16) + (244 / 2 + 16) * (absDiff - 1));
    return {
      transform: `translateX(${xOffset}px) scale(0.6)`,
      opacity: '0',
      zIndex: '1',
      width: '244px',
      height: '163px',
    };
  }

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.styleObserver?.disconnect();
      this.clearTimers();
    });
  }

  ngAfterViewInit(): void {
    this.boot();
    this.watchStyleChanges();
  }

  // ─── Boot ────────────────────────────────────────────────

  private boot(): void {
    const logo = document.querySelector<HTMLElement>('.main__content__logo');
    const subtitle = document.querySelector<HTMLElement>('.main__content__subtitle');
    const button = document.querySelector<HTMLElement>('.main__content__button');
    const socials = document.querySelector<HTMLElement>('.main__content__socials');

    if (!logo || !subtitle || !button || !socials) return;

    this.booted = true;

    // Kill old tweens before creating new ones
    gsap.killTweensOf([logo, subtitle, button, socials]);
    ScrollTrigger.getAll().forEach(t => t.kill());

    gsap.set(logo, { filter: 'blur(20px)', opacity: 0 });
    gsap.set(subtitle, { opacity: 0 });
    gsap.set(button, { opacity: 0, y: 20 });
    gsap.set(socials, { opacity: 0, y: 20 });

    const tl = gsap.timeline({ delay: 0.3 });

    tl.to(logo, { filter: 'blur(0px)', opacity: 1, duration: 1.5, ease: 'power2.out' }, 0);
    tl.to(subtitle, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.8);
    tl.to(button, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 1.2);
    tl.to(socials, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 1.4);

    this.delay(() => this.startScramble(subtitle), 1100);

    this.delay(() => {
      ScrollTrigger.refresh(true);
      this.initRevealOnScroll();
      this.initDimOnScroll();
      this.initCardFlip();
      this.initClickEffects();
    }, 200);
  }

  // ─── Watch style HMR ────────────────────────────────────

  private watchStyleChanges(): void {
    let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

    const scheduleRefresh = () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 100);
    };

    this.styleObserver = new MutationObserver(scheduleRefresh);

    this.styleObserver.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });
  }

  // ─── Helpers ─────────────────────────────────────────────

  private delay(fn: () => void, ms: number): void {
    const id = setTimeout(fn, ms);
    this.timers.push(id);
  }

  private clearTimers(): void {
    this.timers.forEach(t => {
      clearInterval(t as unknown as number);
      clearTimeout(t as unknown as number);
    });
    this.timers = [];
  }

  // ─── Scramble text ───────────────────────────────────────

  private startScramble(el: HTMLElement): void {
    el.textContent = '';

    const spans: HTMLSpanElement[] = [];
    for (let i = 0; i < SUBTITLE_TEXT.length; i++) {
      const span = document.createElement('span');
      span.className = 'scramble-char';
      const ch = SUBTITLE_TEXT[i];
      span.textContent = (ch === ' ' || ch === '•')
        ? (ch === ' ' ? '\u00A0' : ch)
        : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      span.style.display = 'inline-block';
      el.appendChild(span);
      spans.push(span);
    }

    const total = spans.length;
    const scrambleDuration = 1500;

    spans.forEach((span, i) => {
      const finalChar = SUBTITLE_TEXT[i];
      if (finalChar === ' ' || finalChar === '•') return;

      const resolveAt = scrambleDuration * (i / total);
      let elapsed = 0;

      const interval = setInterval(() => {
        elapsed += 50;
        if (elapsed >= resolveAt) {
          clearInterval(interval);
          span.textContent = finalChar;
          return;
        }
        span.textContent = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }, 50);
      this.timers.push(interval as unknown as ReturnType<typeof setTimeout>);
    });
  }

  // ─── Reveal on scroll ────────────────────────────────────

  private initRevealOnScroll(): void {
    gsap.utils.toArray<HTMLElement>('.reveal-on-scroll').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }

  // ─── Dim on scroll ───────────────────────────────────────

  private initDimOnScroll(): void {
    gsap.utils.toArray<HTMLElement>('.dim-on-scroll').forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const inView = self.progress > 0.15 && self.progress < 0.85;
          gsap.to(el, {
            opacity: inView ? 1 : 0.7,
            filter: inView ? 'brightness(1)' : 'brightness(0.7)',
            duration: 0.5,
            overwrite: true,
          });
        },
      });
    });
  }

  // ─── Card flip ───────────────────────────────────────────

  private initCardFlip(): void {
    gsap.utils.toArray<HTMLElement>('.show__content__item').forEach((card) => {
      const inner = card.querySelector('.card-inner') as HTMLElement;
      if (!inner) return;

      gsap.set(inner, { rotateY: 180 });

      ScrollTrigger.create({
        trigger: card,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => gsap.to(inner, { rotateY: 0, duration: 0.8, ease: 'power2.inOut' }),
        onLeave: () => gsap.to(inner, { rotateY: 180, duration: 0.8, ease: 'power2.inOut' }),
        onEnterBack: () => gsap.to(inner, { rotateY: 0, duration: 0.8, ease: 'power2.inOut' }),
        onLeaveBack: () => gsap.to(inner, { rotateY: 180, duration: 0.8, ease: 'power2.inOut' }),
      });
    });
  }

  // ─── Click effects ──────────────────────────────────────

  private initClickEffects(): void {
    const mainBtn = document.querySelector<HTMLElement>('.main__content__button');
    if (mainBtn) this.pressEffect(mainBtn, 0.93);

    document.querySelectorAll<HTMLElement>('.social').forEach(el => {
      this.pressEffect(el, 0.85);
    });

    document.querySelectorAll<HTMLElement>('.info__button').forEach(el => {
      this.pressEffect(el, 0.9);
    });

    document.querySelectorAll<HTMLElement>('.show__content__item').forEach(el => {
      this.pressEffect(el, 0.97);
    });
  }

  private pressEffect(el: HTMLElement, scale: number): void {
    const onDown = () => {
      gsap.to(el, {
        scale,
        duration: 0.12,
        ease: 'power2.in',
        overwrite: true,
      });
    };

    const onUp = () => {
      gsap.to(el, {
        scale: 1,
        duration: 0.35,
        ease: 'elastic.out(1, 0.4)',
        overwrite: true,
      });
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointerleave', onUp);
    el.addEventListener('pointercancel', onUp);
  }

  // ─── Cleanup ─────────────────────────────────────────────

  ngOnDestroy(): void {
    this.clearTimers();
    this.styleObserver?.disconnect();
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.killTweensOf('*');
  }
}
