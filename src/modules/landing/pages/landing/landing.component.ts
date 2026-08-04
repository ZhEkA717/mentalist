import {AfterViewInit, ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, OnDestroy, signal, TemplateRef, viewChild, viewChildren} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {NgTemplateOutlet} from '@angular/common';
import {TuiCalendar} from '@taiga-ui/core/components/calendar';
import {TuiDay, TuiMonth} from '@taiga-ui/cdk/date-time';
import {CarouselComponent} from '../../components/carousel/carousel.component';
import {MarqueeDirective} from '../../directives/marquee.directive';
import {TelegramService, RequestForm} from '../../services/telegram.service';
import {TuiLoader} from '@taiga-ui/core';
import {TuiNotificationService} from '@taiga-ui/core/components/notification';
import {catchError, EMPTY, finalize} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {AppWheelSmithDirective} from '../../../../shared/app-wheel-smith.directive';

gsap.registerPlugin(ScrollTrigger);

const SUBTITLE_TEXT = 'Менталист • Психологический иллюзионист • Дипломированный психолог • Гипнотизёр';
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
    TuiLoader,
    AppWheelSmithDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  private timers: ReturnType<typeof setTimeout | typeof setInterval>[] = [];
  private styleObserver: MutationObserver | null = null;
  private booted = false;

  private telegram = inject(TelegramService);
  private readonly notifications = inject(TuiNotificationService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly activatedRoute = inject(ActivatedRoute);

  protected successTpl = viewChild<TemplateRef<unknown>>('successNotification');
  protected errorTpl = viewChild<TemplateRef<unknown>>('errorNotification');
  protected validationTpl = viewChild<TemplateRef<unknown>>('validationNotification');
  protected videoContainers = viewChildren<ElementRef<HTMLElement>>('videoContainer');
  protected logo = viewChild<ElementRef<HTMLElement>>('logo');
  protected subtitle = viewChild<ElementRef<HTMLElement>>('subtitle');
  protected button = viewChild<ElementRef<HTMLElement>>('button');
  protected socials = viewChild<ElementRef<HTMLElement>>('socialsContainer');
  protected videosSection = viewChild<ElementRef<HTMLElement>>('videosSection');

  protected readonly currentYear = new Date().getFullYear();
  private readonly isRuDomain =  this.activatedRoute.snapshot.queryParams['ru'] || window.location.hostname.endsWith('.ru');
  private readonly videoUrls: Array<{youtube: string; vk: string}> = [
    {youtube: 'https://www.youtube.com/embed/sNIPgihatyU', vk: 'https://vkvideo.ru/video_ext.php?oid=-65614643&id=456239035&hash=9ae4ca3a7f22cc57&hd=4'},
    {youtube: 'https://www.youtube.com/embed/X3jvY2xpmfc', vk: 'https://vkvideo.ru/video_ext.php?oid=-65614643&id=456239034&hash=69a23c2952842a28&hd=4'},
    {youtube: 'https://www.youtube.com/embed/YulDfOQiDk8', vk: 'https://vkvideo.ru/video_ext.php?oid=-65614643&id=456239036&hash=26ddd6f8d47e1ba1&hd=4'},
  ];
  protected readonly videos = computed(() =>
    this.videoUrls.map(v => this.sanitizer.bypassSecurityTrustResourceUrl(this.isRuDomain ? v.vk : v.youtube)),
  );
  protected subtitleText = SUBTITLE_TEXT;
  protected submitting = signal(false);
  protected validationMessage = signal('');

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

  protected toggleFullscreen(event: Event): void {
    const container = (event.currentTarget as HTMLElement).closest('.video-container');
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
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
    { label: 'Выступления', href: '#shows' },
    { label: 'Об александре', href: '#about' },
    { label: 'Авторские шоу', href: '#lectures' },
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
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  protected scrollToSecondVideo(): void {
    const containers = this.videoContainers();
    if (containers.length < 2) return;
    const el = containers[1].nativeElement;
    const parent = el.parentElement;
    if (!parent) return;
    const offset = el.offsetLeft - (parent.clientWidth - el.offsetWidth) / 2 - 48;
    parent.scrollTo({ left: offset, behavior: 'smooth' });
  }

  protected onSubmit(): void {
    if (this.submitting()) return;

    if (this.form.invalid) {
      const missing: string[] = [];
      if (this.form.get('name')?.hasError('required')) missing.push('Имя');
      if (this.form.get('phone')?.hasError('required')) missing.push('Телефон или Telegram');

      this.validationMessage.set(`Пожалуйста, заполните: ${missing.join(', ')}`);
      this.notifications.open(this.validationTpl(), {
        autoClose: 6000,
        block: 'start',
        inline: 'end',
        closable: true,
        icon: '',
      }).subscribe();
      return;
    }

    this.submitting.set(true);

    const raw = this.form.getRawValue();
    const data: RequestForm = {
      name: raw.name,
      phone: raw.phone,
      eventDate: raw.eventDate ? this.formatDate(raw.eventDate) : '',
      city: raw.city,
      eventType: raw.eventType,
      comment: raw.comment,
    };

    this.telegram.submitForm(data)
      .pipe(
        finalize(() => {
          this.submitting.set(false);
        }),
        catchError(() => {
          this.notifications.open(this.errorTpl(), {
            autoClose: 7000,
            block: 'start',
            inline: 'end',
            closable: false,
            icon: '',
          }).subscribe();
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.form.reset();
        this.notifications.open(this.successTpl(), {
          autoClose: 5000,
          block: 'start',
          inline: 'end',
          closable: false,
          icon: '',
        }).subscribe();
      });
  }

  // ─── Boot ────────────────────────────────────────────────

  private boot(): void {
    const logo = this.logo()?.nativeElement;
    const subtitle = this.subtitle()?.nativeElement;
    const button = this.button()?.nativeElement;
    const socials = this.socials()?.nativeElement;

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
      this.initScrollToSecondVideo();
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
    let bulletCount = 0;
    for (let i = 0; i < SUBTITLE_TEXT.length; i++) {
      const span = document.createElement('span');
      span.className = 'scramble-char';
      const ch = SUBTITLE_TEXT[i];
      span.textContent = (ch === ' ' || ch === '•')
        ? (ch === ' ' ? '\u00A0' : ch)
        : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      el.appendChild(span);
      if (ch === '•') {
        bulletCount++;
        if (bulletCount === 2) {
          el.appendChild(document.createElement('br'));
        }
      }
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
            start: 'top 100%',
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

  private initScrollToSecondVideo(): void {
    const el = this.videosSection()?.nativeElement;
    if (!el) return;

    let triggered = false;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 100%',
      onEnter: () => {
        if (triggered) return;
        triggered = true;
        this.scrollToSecondVideo();
      },
    });
  }

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

  // ─── Cleanup ─────────────────────────────────────────────

  ngOnDestroy(): void {
    this.clearTimers();
    this.styleObserver?.disconnect();
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.killTweensOf('*');
  }
}
