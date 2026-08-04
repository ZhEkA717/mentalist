import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initRevealOnScroll(container: Element | HTMLElement): void {
  gsap.utils.toArray<HTMLElement>('.reveal-on-scroll', container).forEach((el) => {
    gsap.fromTo(el,
      {opacity: 0, y: 26},
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 100%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

export function initDimOnScroll(container: Element | HTMLElement): void {
  gsap.utils.toArray<HTMLElement>('.dim-on-scroll', container).forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const inView = self.progress > 0.15 && self.progress < 0.85;
        gsap.to(el, {
          opacity: inView ? 1 : 0.7,
          filter: inView ? 'brightness(1)' : 'brightness(0.7)',
          duration: 0.5,
          overwrite: true,
        });
      },
    });
  });
}

export function killScrollAnimations(container: Element | HTMLElement): void {
  const elements = container.querySelectorAll('.reveal-on-scroll, .dim-on-scroll');
  elements.forEach((el) => {
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars.trigger === el || trigger.trigger === el) {
        trigger.kill();
      }
    });
    gsap.killTweensOf(el);
  });
}
