import {signal} from '@angular/core';

export interface ModalCloseOptions {
  lockScroll?: boolean;
}

export function createModalClose(options: ModalCloseOptions = {}) {
  const closing = signal(false);
  const rendered = signal(false);
  let closeTimeout: ReturnType<typeof setTimeout> | null = null;
  let scrollLocked = false;

  function cancelClose(): void {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
  }

  function lockScroll(): void {
    if (typeof document === 'undefined' || scrollLocked) return;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    scrollLocked = true;
  }

  function unlockScroll(): void {
    if (typeof document === 'undefined' || !scrollLocked) return;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    scrollLocked = false;
  }

  function prepareOpen(): void {
    cancelClose();
    closing.set(false);
    rendered.set(true);
    if (options.lockScroll) {
      lockScroll();
    }
  }

  function close(callback?: () => void): void {
    closing.set(true);
    closeTimeout = setTimeout(() => {
      closing.set(false);
      rendered.set(false);
      closeTimeout = null;
      if (options.lockScroll) {
        unlockScroll();
      }
      callback?.();
    }, 400);
  }

  function destroy(): void {
    cancelClose();
    if (options.lockScroll && scrollLocked) {
      unlockScroll();
    }
    closing.set(false);
    rendered.set(false);
  }

  return {
    closing,
    rendered,
    prepareOpen,
    close,
    destroy,
  };
}