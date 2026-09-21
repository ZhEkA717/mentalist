import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, OnDestroy} from '@angular/core';
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
  private readonly el = inject(ElementRef);
  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    this.triggers = initRevealOnScroll(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
    gsap.killTweensOf(this.el.nativeElement.querySelectorAll('.reveal-on-scroll'));
  }
}
