import {loadGsap} from './gsap';
import type {ScrollTrigger} from './gsap';

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

export async function initRevealOnScroll(container: Element | HTMLElement): Promise<ScrollTrigger[]> {
  if (!isBrowser) return [];
  const {gsap, ScrollTrigger} = await loadGsap();
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

export async function initDimOnScroll(container: Element | HTMLElement): Promise<ScrollTrigger[]> {
  if (!isBrowser) return [];
  const {gsap, ScrollTrigger} = await loadGsap();
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