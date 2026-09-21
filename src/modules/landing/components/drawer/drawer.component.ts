import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {createModalClose} from '../../utils/modal-close';

@Component({
  selector: 'app-drawer',
  standalone: true,
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent implements OnDestroy {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);

  isOpen = input<boolean>(false);
  closed = output<void>();

  protected readonly isMobile = signal(false);
  private readonly modal = createModalClose({lockScroll: true});
  protected readonly closing = this.modal.closing;
  protected readonly rendered = this.modal.rendered;

  protected readonly animationClass = computed(() => {
    const close = this.closing();
    const byButton = this.closeByButton();
    if (close) {
      return byButton ? 'drawer--close-left' : 'drawer--close';
    }
    return 'drawer--top-open';
  });

  private touchStartY = 0;
  private wasOpen = false;
  private closeByButton = signal(false);

  constructor() {
    const sub = this.breakpointObserver.observe('(max-width: 950px)').subscribe(result => {
      this.isMobile.set(result.matches);
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());

    effect(() => {
      const open = this.isOpen();
      const mobile = this.isMobile();

      if (!mobile) {
        this.wasOpen = false;
        return;
      }

      if (open && !this.wasOpen) {
        this.modal.prepareOpen();
        this.wasOpen = true;
      } else if (!open && this.wasOpen) {
        this.modal.close(() => {
          this.closed.emit();
        });
        this.wasOpen = false;
      }
    });
  }

  protected close(): void {
    this.modal.close(() => {
      this.closed.emit();
    });
    this.wasOpen = false;
  }

  protected closeFromButton(): void {
    this.closeByButton.set(true);
    this.modal.close(() => {
      this.closeByButton.set(false);
      this.closed.emit();
    });
    this.wasOpen = false;
  }

  protected onHandleTouchStart(event: TouchEvent): void {
    this.touchStartY = event.touches[0].clientY;
  }

  protected onHandleTouchMove(event: TouchEvent): void {
    event.preventDefault();
    const deltaY = this.touchStartY - event.touches[0].clientY;
    if (deltaY > 80) {
      this.touchStartY = 0;
      this.close();
    }
  }

  protected onHandleTouchEnd(): void {
    this.touchStartY = 0;
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }
}
