import {
  AfterViewInit,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  NgZone,
  OnDestroy,
  PLATFORM_ID
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {convertToBoolean} from './utils';

@Directive({
  selector: '[sitUiWheelSmith]',
  standalone: true,
})
export class SitUiWheelSmithDirective implements AfterViewInit, OnDestroy {
  elementRef: ElementRef | null = null;
  protected platformId = inject<Record<string, unknown>>(PLATFORM_ID);
  private ngZone = inject(NgZone);
  private targetScroll = 0;
  private currentScroll = 0;
  private animating = false;
  private frameId: number | null = null;

  enabled = input(false, {
    transform: convertToBoolean,
    alias: 'sitUiWheelSmith',
  });

  constructor() {
    effect(() => {
      if (this.enabled()) {
        this.subscribe();
      } else {
        this.unsubscribe();
      }
    });
  }

  ngAfterViewInit() {
    if (this.enabled()) {
      this.subscribe();
    }
  }

  subscribe() {
    if (isPlatformBrowser(this.platformId)) {
      const native = this.elementRef?.nativeElement;
      this.ngZone.runOutsideAngular(() => {
        native.addEventListener('wheel', this.onWheel, { passive: false });
      });
    }
  }

  unsubscribe() {
    if (isPlatformBrowser(this.platformId)) {
      const native = this.elementRef?.nativeElement;
      native.removeEventListener('wheel', this.onWheel);
      if (this.frameId) cancelAnimationFrame(this.frameId);
    }
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();

    const native = this.elementRef?.nativeElement;
    const maxScroll = native.scrollWidth - native.clientWidth;
    const sensitivity = 2.0; // чем больше — тем сильнее отклик

    // добавляем к целевому скроллу
    this.targetScroll += e.deltaY * sensitivity;

    // ограничиваем
    this.targetScroll = Math.max(0, Math.min(this.targetScroll, maxScroll));

    if (!this.animating) {
      this.animate();
    }
  };

  private animate() {
    this.animating = true;

    const native = this.elementRef?.nativeElement;

    // сглаженное движение
    this.currentScroll += (this.targetScroll - this.currentScroll) * 0.9;

    native.scrollLeft = this.currentScroll;

    if (Math.abs(this.targetScroll - this.currentScroll) > 0.5) {
      this.frameId = requestAnimationFrame(() => this.animate());
    } else {
      this.animating = false;
      this.currentScroll = this.targetScroll;
      this.frameId = null;
    }
  }
}
