import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, OnDestroy, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {initRevealOnScroll} from '../../utils/scroll-animations';
import {killGsapTweens} from '../../utils/gsap';
import type {ScrollTrigger} from '../../utils/gsap';

@Component({
  selector: 'app-lectures',
  standalone: true,
  templateUrl: './lectures.component.html',
  styleUrl: './lectures.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LecturesSectionComponent implements AfterViewInit, OnDestroy {
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
}
