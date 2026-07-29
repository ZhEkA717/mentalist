import {AfterViewInit, Directive, ElementRef, input} from '@angular/core';

@Directive({
  selector: '[appMarquee]',
  standalone: true,
})
export class MarqueeDirective implements AfterViewInit {
  private get host(): HTMLElement {
    return this.el.nativeElement;
  }

  readonly appMarquee = input<string>();
  readonly marqueeMode = input<'always' | 'mobile'>('always');

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.host.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      const selector = this.appMarquee();
      const track: HTMLElement | null = selector
        ? this.host.querySelector<HTMLElement>(selector)
        : (this.host.firstElementChild as HTMLElement | null);

      if (!track) return;

      const activate = (): void => {
        const fragment = document.createDocumentFragment();
        Array.from(track.children).forEach((child) => {
          fragment.appendChild(child.cloneNode(true));
        });
        track.appendChild(fragment);
        this.host.classList.add('marquee-active');
        track.classList.add('marquee-track');
      };

      if (this.marqueeMode() === 'always') {
        activate();
        return;
      }

      if (window.innerWidth <= 1200) {
        activate();
        return;
      }

      const check = (): void => {
        if (track.scrollWidth > this.host.clientWidth) {
          activate();
          observer.disconnect();
        }
      };

      const observer = new ResizeObserver(check);
      observer.observe(track);
      check();
    });
  }
}
