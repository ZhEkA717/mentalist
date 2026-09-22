import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  output,
  viewChild
} from '@angular/core';
import {isPlatformBrowser, NgOptimizedImage} from '@angular/common';
import {SocialsComponent} from '../socials/socials.component';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SUBTITLE_TEXT = 'Менталист • Психологический иллюзионист • Дипломированный психолог • Гипнотизёр';
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [SocialsComponent, NgOptimizedImage],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSectionComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private timers: ReturnType<typeof setTimeout | typeof setInterval>[] = [];
  private scrollTriggers: ScrollTrigger[] = [];
  protected subtitleText = SUBTITLE_TEXT;

  logoBg = viewChild<ElementRef<HTMLElement>>('logoBg');
  logo = viewChild<ElementRef<HTMLElement>>('logo');
  subtitle = viewChild<ElementRef<HTMLElement>>('subtitle');
  button = viewChild<ElementRef<HTMLElement>>('button');
  heroBg = viewChild<ElementRef<HTMLElement>>('heroBg');
  character = viewChild<ElementRef<HTMLElement>>('character');
  socialsComponent = viewChild<SocialsComponent>('socialsComponent');

  bootComplete = output<void>();
  sectionClick = output<{id: string; block: ScrollLogicalPosition; offset: number}>();

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.boot();
    this.initParallax();
  }

  ngOnDestroy(): void {
    this.timers.forEach(id => {
      clearTimeout(id);
      clearInterval(id);
    });

    this.scrollTriggers.forEach(t => t.kill());
  }

  protected scrollTo(event: Event, id: string, block: ScrollLogicalPosition = 'start'): void {
    event.preventDefault();
    this.sectionClick.emit({id, block, offset: 0});
  }

  private boot(): void {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const logoEl = (isMobile ? this.logoBg() : this.logo())?.nativeElement;
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

    this.delay(() => this.bootComplete.emit(), 200);
  }

  private delay(fn: () => void, ms: number): void {
    const id = setTimeout(fn, ms);
    this.timers.push(id);
  }

  private initParallax(): void {
    const heroEl = document.getElementById('hero');
    const bgEl = this.heroBg()?.nativeElement;
    const logoBgEl = this.logoBg()?.nativeElement;
    if (!heroEl || !bgEl) return;

    const bgTrigger = gsap.to(bgEl, {
      y: 300,
      ease: 'none',
      scrollTrigger: {
        trigger: heroEl,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
    if (bgTrigger.scrollTrigger) this.scrollTriggers.push(bgTrigger.scrollTrigger);

    if (logoBgEl) {
      const logoTrigger = gsap.to(logoBgEl, {
        y: 200,
        ease: 'none',
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
      if (logoTrigger.scrollTrigger) this.scrollTriggers.push(logoTrigger.scrollTrigger);
    }
  }
}
