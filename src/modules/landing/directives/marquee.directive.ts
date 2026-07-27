import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[appMarquee]',
  standalone: true,
})
export class MarqueeDirective implements AfterViewInit {
  private get host(): HTMLElement {
    return this.el.nativeElement;
  }

  @Input() appMarquee?: string;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.host.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      const track = this.appMarquee
        ? this.host.querySelector<HTMLElement>(this.appMarquee)
        : (this.host.firstElementChild as HTMLElement);

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
