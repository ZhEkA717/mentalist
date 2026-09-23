import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  output,
  PLATFORM_ID,
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
  button = viewChild<ElementRef<HTMLElement>>('button');
  heroBg = viewChild<ElementRef<HTMLElement>>('heroBg');

  bootComplete = output<void>();
  sectionClick = output<{id: string; block: ScrollLogicalPosition; offset: number}>();

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

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
