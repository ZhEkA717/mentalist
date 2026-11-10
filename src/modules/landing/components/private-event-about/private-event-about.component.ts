import {AfterViewInit, Component, ElementRef, inject, OnDestroy, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, NgOptimizedImage, NgTemplateOutlet} from "@angular/common";
import {initRevealOnScroll} from '../../utils/scroll-animations';
import {killGsapTweens} from '../../utils/gsap';
import type {ScrollTrigger} from '../../utils/gsap';

@Component({
  selector: 'app-private-event-about',
    imports: [
        NgOptimizedImage,
        NgTemplateOutlet
    ],
  templateUrl: './private-event-about.component.html',
  styleUrl: './private-event-about.component.scss',
})
export class PrivateEventAboutComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private readonly el = inject(ElementRef);
  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    void initRevealOnScroll(this.el.nativeElement).then(triggers => {
      this.triggers.push(...triggers);
    });
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
    if (isPlatformBrowser(this.platformId)) {
      killGsapTweens(this.el.nativeElement.querySelectorAll('.reveal-on-scroll'));
    }
  }

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
}
