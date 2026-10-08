import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import type {Gsap, ScrollTrigger} from '../../utils/gsap';
import {loadGsap} from '../../utils/gsap';

@Component({
  selector: 'app-corporate-about',
  standalone: true,
  templateUrl: './corporate-about.component.html',
  styleUrl: './corporate-about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class CorporateAboutSectionComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private host = inject(ElementRef<HTMLElement>);
  private scrollTriggers: ScrollTrigger[] = [];
  protected readonly items = [
    {
      icon: '/assets/icons/star-icon.svg',
      text: 'современно\n' +
        'и стильно',
      width: 134,
      height: 134,

    },
    {
      icon: '/assets/icons/mask-icon.svg',
      text: 'интеллигентный \n' +
        'юмор',
      width: 116,
      height: 116,
    },
    {
      icon: '/assets/icons/peoples-icon.svg',
      text: 'подходит для \n' +
        'любой аудитории',
      width: 174,
      height: 137,
    },
    {
      icon: '/assets/icons/wine-glasses.svg',
      text: 'незабываемые \n' +
        'эмоции',
      width: 134,
      height: 134,
    },
  ]

  bg = viewChild<ElementRef<HTMLElement>>('bg');
  character = viewChild<ElementRef<HTMLElement>>('character');

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    void loadGsap().then(({gsap}) => this.initParallax(gsap));
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach(t => t.kill());
  }

  private initParallax(gsap: Gsap): void {
    const sectionEl = this.host.nativeElement;
    const bgEl = this.bg()?.nativeElement;
    if (!sectionEl || !bgEl) return;

    const bgTween = gsap.to(bgEl, {
      y: 300,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionEl,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
    if (bgTween.scrollTrigger) this.scrollTriggers.push(bgTween.scrollTrigger);

    const characterEl = this.character()?.nativeElement;
    if (characterEl) {
      const characterTween = gsap.to(characterEl, {
        y: 150,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
      if (characterTween.scrollTrigger) this.scrollTriggers.push(characterTween.scrollTrigger);
    }
  }
}
