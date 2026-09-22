import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, OnDestroy, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {initRevealOnScroll} from '../../utils/scroll-animations';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutSectionComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private readonly el = inject(ElementRef);
  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.triggers = initRevealOnScroll(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
    if (isPlatformBrowser(this.platformId)) {
      gsap.killTweensOf(this.el.nativeElement.querySelectorAll('.reveal-on-scroll'));
    }
  }
}
