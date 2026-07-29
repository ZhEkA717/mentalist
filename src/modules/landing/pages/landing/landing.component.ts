import {AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {NgTemplateOutlet} from '@angular/common';
import {TuiCalendar} from '@taiga-ui/core/components/calendar';
import {TuiDay, TuiMonth} from '@taiga-ui/cdk/date-time';
import {CarouselComponent} from '../../components/carousel/carousel.component';
import {MarqueeDirective} from '../../directives/marquee.directive';
import {TelegramService, RequestForm} from '../../services/telegram.service';

gsap.registerPlugin(ScrollTrigger);

const SUBTITLE_TEXT = 'Менталист • Психологический иллюзионист • дипломированный психолог • гипнотизёр';
const SCRAMBLE_CHARS = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ абвгдежзиклмнопрстуфхцчшщэюя';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  imports: [
    ReactiveFormsModule,
    TuiCalendar,
    CarouselComponent,
    MarqueeDirective,
    NgTemplateOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  private timers: ReturnType<typeof setTimeout | typeof setInterval>[] = [];
  private styleObserver: MutationObserver | null = null;
  private booted = false;

  private telegram = inject(TelegramService);

  protected subtitleText = SUBTITLE_TEXT;
  protected submitting = signal(false);
  protected submitSuccess = signal(false);
  protected submitError = signal('');

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    eventDate: new FormControl<TuiDay | null>(null),
    city: new FormControl('', { nonNullable: true }),
    eventType: new FormControl('', { nonNullable: true }),
    comment: new FormControl('', { nonNullable: true }),
  });

  protected calendarOpen = false;
  protected calendarMonth = new TuiMonth(new Date().getFullYear(), new Date().getMonth());

  protected toggleCalendar(): void {
    this.calendarOpen = !this.calendarOpen;
    if (this.calendarOpen) {
      const date = this.form.get('eventDate')?.value;
      if (date) {
        this.calendarMonth = new TuiMonth(date.year, date.month);
      }
    }
  }

  protected closeCalendar(): void {
    this.calendarOpen = false;
  }

  protected onDayClick(day: TuiDay): void {
    this.form.get('eventDate')?.setValue(day);
    this.calendarOpen = false;
  }

  protected formatDate(day: TuiDay | null): string {
    if (!day) return '';
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
    ];
    return `${day.day} ${months[day.month]} ${day.year}`;
  }

  protected items: { label: string; href: string }[] = [
    { label: 'Главная', href: '#hero' },
    { label: 'Авторские шоу', href: '#promo' },
    { label: 'Выступления', href: '#shows' },
    { label: 'Об александре', href: '#about' },
    { label: 'Лекции', href: '#lectures' },
    { label: 'Медиа', href: '#media' },
    { label: 'Контакты', href: '#contacts' },
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

  // ─── Smooth scroll ────────────────────────────────────────

  protected scrollTo(event: Event, id: string): void {
    event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const headerOffset = 70;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid || this.submitting()) return;

    this.submitting.set(true);
    this.submitError.set('');
    this.submitSuccess.set(false);

    try {
      const raw = this.form.getRawValue();
      const data: RequestForm = {
        name: raw.name,
        phone: raw.phone,
        eventDate: raw.eventDate ? this.formatDate(raw.eventDate) : '',
        city: raw.city,
        eventType: raw.eventType,
        comment: raw.comment,
      };

      await this.telegram.submitForm(data);
      this.submitSuccess.set(true);
      this.form.reset();
    } catch {
      this.submitError.set('Не удалось отправить заявку. Попробуйте позже или напишите в Telegram.');
    } finally {
      this.submitting.set(false);
    }
  }

  // ─── Boot ────────────────────────────────────────────────

  private boot(): void {
    const logo = document.querySelector<HTMLElement>('.main__content__logo');
    const subtitle = document.querySelector<HTMLElement>('.main__content__subtitle');
    const button = document.querySelector<HTMLElement>('.main__content__button');
    const socials = document.querySelector<HTMLElement>('.socials');

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

    document.querySelectorAll<HTMLElement>('.about__content__info .button, .lectures__content .button, .main__left__button').forEach(el => {
      this.pressEffect(el, 0.93);
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
