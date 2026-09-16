import {signal} from '@angular/core';

export interface ModalCloseOptions {
  lockScroll?: boolean;
}

export function createModalClose(options: ModalCloseOptions = {}) {
  const closing = signal(false);
  const rendered = signal(false);
  let closeTimeout: ReturnType<typeof setTimeout> | null = null;

  function cancelClose(): void {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
  }

  function lockScroll(): void {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  }

  function unlockScroll(): void {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
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
  }

  return {
    closing,
    rendered,
    prepareOpen,
    close,
    destroy,
  };
}
