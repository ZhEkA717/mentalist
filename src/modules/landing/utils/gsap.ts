import type {gsap as GsapValue} from 'gsap';
import type {ScrollTrigger as ScrollTriggerValue} from 'gsap/ScrollTrigger';

export type Gsap = typeof GsapValue;
export type ScrollTrigger = ScrollTriggerValue;
export type ScrollTriggerClass = typeof ScrollTriggerValue;

export interface GsapBundle {
  gsap: typeof GsapValue;
  ScrollTrigger: typeof ScrollTriggerValue;
}

let bundlePromise: Promise<GsapBundle> | null = null;
let resolveBundle: ((bundle: GsapBundle) => void) | null = null;
let rejectBundle: ((error: unknown) => void) | null = null;
let loaded = false;
const afterLoadHandlers: Array<() => void> = [];

const IDLE_LOAD_TIMEOUT_MS = 2000;

export function loadGsap(): Promise<GsapBundle> {
  if (bundlePromise) return bundlePromise;
  bundlePromise = new Promise<GsapBundle>((resolve, reject) => {
    resolveBundle = resolve;
    rejectBundle = reject;
  });
  scheduleGsapLoad();
  return bundlePromise;
}

function scheduleGsapLoad(): void {
  const startLoad = (): void => {
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([gsapModule, scrollTriggerModule]) => {
        gsapModule.gsap.registerPlugin(scrollTriggerModule.ScrollTrigger);
        loaded = true;
        afterLoadHandlers.splice(0).forEach((handler) => handler());
        resolveBundle?.({gsap: gsapModule.gsap, ScrollTrigger: scrollTriggerModule.ScrollTrigger});
      })
      .catch((error) => {
        bundlePromise = null;
        loaded = false;
        resolveBundle = null;
        rejectBundle?.(error);
      });
  };

  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(startLoad, {timeout: IDLE_LOAD_TIMEOUT_MS});
  } else {
    setTimeout(startLoad, 0);
  }
}

export function isGsapLoaded(): boolean {
  return loaded;
}

export function onGsapLoaded(handler: () => void): void {
  if (loaded) {
    handler();
  } else {
    afterLoadHandlers.push(handler);
  }
}

export function killGsapTweens(
  target: Parameters<typeof GsapValue['killTweensOf']>[0] | null | undefined
): void {
  if (!target || !loaded) return;
  void loadGsap().then(({gsap}) => gsap.killTweensOf(target));
}