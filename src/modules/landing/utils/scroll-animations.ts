import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initRevealOnScroll(container: Element | HTMLElement): ScrollTrigger[] {
  const triggers: ScrollTrigger[] = [];

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
    const st = ScrollTrigger.getAll().at(-1);
    if (st) triggers.push(st);
  });

  return triggers;
}

export function initDimOnScroll(container: Element | HTMLElement): ScrollTrigger[] {
  const triggers: ScrollTrigger[] = [];

  gsap.utils.toArray<HTMLElement>('.dim-on-scroll', container).forEach((el) => {
    el.classList.add('dim-on-scroll--active');
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const inView = self.progress > 0.15 && self.progress < 0.85;
        el.classList.toggle('dim-on-scroll--dimmed', !inView);
      },
    });
    triggers.push(st);
  });

  return triggers;
}

export function killScrollAnimations(
  container: Element | HTMLElement,
  ownedTriggers?: ScrollTrigger[],
): void {
  if (ownedTriggers) {
    ownedTriggers.forEach((t) => t.kill());
  } else {
    const elements = container.querySelectorAll('.reveal-on-scroll, .dim-on-scroll');
    elements.forEach((el) => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === el || trigger.trigger === el) {
          trigger.kill();
        }
      });
    });
  }

  const revealElements = container.querySelectorAll('.reveal-on-scroll');
  const dimElements = container.querySelectorAll('.dim-on-scroll');
  revealElements.forEach((el) => gsap.killTweensOf(el));
  dimElements.forEach((el) => gsap.killTweensOf(el));
}
