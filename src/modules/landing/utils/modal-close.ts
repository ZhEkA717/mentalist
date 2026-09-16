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

  function prepareOpen(): void {
    cancelClose();
    closing.set(false);
    rendered.set(true);
    if (options.lockScroll) {
      document.body.classList.add('no-scroll');
    }
  }

  function close(callback?: () => void): void {
    closing.set(true);
    closeTimeout = setTimeout(() => {
      closing.set(false);
      rendered.set(false);
      closeTimeout = null;
      if (options.lockScroll) {
        document.body.classList.remove('no-scroll');
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
