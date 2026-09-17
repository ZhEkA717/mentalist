import {afterNextRender, AfterViewInit, Component, ElementRef, OnDestroy, output, viewChild} from '@angular/core';
import {SocialsComponent} from '../socials/socials.component';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SUBTITLE_TEXT = 'Менталист • Психологический иллюзионист • Дипломированный психолог • Гипнотизёр';
const SUBTITLE_TEXT_MOBILE = 'Менталист • Гипнотизёр • Психолог • Психологический иллюзионист';
const SCRAMBLE_CHARS = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ абвгдежзиклмнопрстуфхцчшщэюя';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [SocialsComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroSectionComponent implements AfterViewInit, OnDestroy {
  private timers: ReturnType<typeof setTimeout | typeof setInterval>[] = [];

  protected subtitleText = SUBTITLE_TEXT;

  logo = viewChild<ElementRef<HTMLElement>>('logo');
  subtitle = viewChild<ElementRef<HTMLElement>>('subtitle');
  button = viewChild<ElementRef<HTMLElement>>('button');
  heroBg = viewChild<ElementRef<HTMLElement>>('heroBg');
  character = viewChild<ElementRef<HTMLElement>>('character');
  socialsComponent = viewChild<SocialsComponent>('socialsComponent');

  bootComplete = output<void>();
  sectionClick = output<{id: string; block: ScrollLogicalPosition; offset: number}>();

  ngAfterViewInit(): void {
    this.boot();
    this.initParallax();
  }

  ngOnDestroy(): void {
    this.timers.forEach(id => {
      clearTimeout(id);
      clearInterval(id);
    });
    ScrollTrigger.getAll().forEach(t => t.kill());
  }

  protected scrollTo(event: Event, id: string, block: ScrollLogicalPosition = 'start'): void {
    event.preventDefault();
    this.sectionClick.emit({id, block, offset: 0});
  }

  private boot(): void {
    const logoEl = this.logo()?.nativeElement;
    const subtitleEl = this.subtitle()?.nativeElement;
    const buttonEl = this.button()?.nativeElement;
    const socialsEl = this.socialsComponent()?.elementRef.nativeElement;

    if (!logoEl || !subtitleEl || !buttonEl || !socialsEl) return;

    gsap.killTweensOf([logoEl, subtitleEl, buttonEl, socialsEl]);

    gsap.set(logoEl, {filter: 'blur(20px)', opacity: 0});
    gsap.set(subtitleEl, {opacity: 0});
    gsap.set(buttonEl, {opacity: 0, y: 20});
    gsap.set(socialsEl, {opacity: 0, y: 20});

    const tl = gsap.timeline({delay: 0.3});

    tl.to(logoEl, {filter: 'blur(0px)', opacity: 1, duration: 1.5, ease: 'power2.out'}, 0);
    tl.to(subtitleEl, {opacity: 1, duration: 0.4, ease: 'power2.out'}, 0.8);
    tl.to(buttonEl, {opacity: 1, y: 0, duration: 0.6, ease: 'power2.out'}, 1.2);
    tl.to(socialsEl, {opacity: 1, y: 0, duration: 0.6, ease: 'power2.out'}, 1.4);

    this.delay(() => this.startScramble(subtitleEl), 1100);
    this.delay(() => this.bootComplete.emit(), 200);
  }

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

  private delay(fn: () => void, ms: number): void {
    const id = setTimeout(fn, ms);
    this.timers.push(id);
  }

  private initParallax(): void {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) return;

    const heroEl = document.getElementById('hero');
    const bgEl = this.heroBg()?.nativeElement;
    if (!heroEl || !bgEl) return;

    gsap.to(bgEl, {
      y: 200,
      ease: 'none',
      scrollTrigger: {
        trigger: heroEl,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }
}
