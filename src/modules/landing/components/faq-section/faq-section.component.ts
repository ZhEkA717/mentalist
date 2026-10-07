import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnDestroy,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {QuestionAccordionComponent} from '../question-accordion/question-accordion.component';
import {initRevealOnScroll} from '../../utils/scroll-animations';
import {killGsapTweens} from '../../utils/gsap';
import type {ScrollTrigger} from '../../utils/gsap';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq-section',
  imports: [QuestionAccordionComponent],
  templateUrl: './faq-section.component.html',
  styleUrl: './faq-section.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqSectionComponent implements AfterViewInit, OnDestroy {
  items = input<FaqItem[]>([]);

  protected readonly expandedMap: WritableSignal<Record<string, boolean>> = signal({});

  private platformId = inject(PLATFORM_ID);
  private readonly el = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private triggers: ScrollTrigger[] = [];

  protected onAccordionChange(id: string, isOpen: boolean): void {
    this.expandedMap.update(() => {
      const next: Record<string, boolean> = {};
      if (isOpen) {
        next[id] = true;
      }
      return next;
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    void initRevealOnScroll(this.el.nativeElement).then(triggers => {
      this.triggers.push(...triggers);
    });
    this.destroyRef.onDestroy(() => {
      this.triggers.forEach(t => t.kill());
      if (isPlatformBrowser(this.platformId)) {
        killGsapTweens(this.el.nativeElement.querySelectorAll('.reveal-on-scroll'));
      }
    });
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
    if (isPlatformBrowser(this.platformId)) {
      killGsapTweens(this.el.nativeElement.querySelectorAll('.reveal-on-scroll'));
    }
  }
}