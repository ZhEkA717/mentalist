import {AfterViewInit, Component, ElementRef, inject, OnDestroy} from '@angular/core';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {initRevealOnScroll} from '../../utils/scroll-animations';

@Component({
  selector: 'app-lectures',
  standalone: true,
  templateUrl: './lectures.component.html',
  styleUrl: './lectures.component.scss'
})
export class LecturesSectionComponent implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);

  ngAfterViewInit(): void {
    initRevealOnScroll(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.killTweensOf(this.el.nativeElement.querySelectorAll('.reveal-on-scroll'));
  }
}
