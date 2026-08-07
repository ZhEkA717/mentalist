import {Component, DestroyRef, inject, input, OnDestroy, output, signal} from '@angular/core';
import {TuiPopup} from '@taiga-ui/core/portals/popup';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TuiPopup],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
  items = input.required<{ label: string; href: string }[]>();
  sectionClick = output<string>();

  menuOpen = signal(false);
  closing = signal(false);
  activeSection = signal(window.location.hash.slice(1));

  private onHashChange = () => {
    this.activeSection.set(window.location.hash.slice(1));
  };

  constructor() {
    window.addEventListener('hashchange', this.onHashChange);
    inject(DestroyRef).onDestroy(() => {
      window.removeEventListener('hashchange', this.onHashChange);
    });
  }

  protected toggleMenu(): void {
    if (this.menuOpen()) {
      this.closeWithAnimation();
    } else {
      this.closing.set(false);
      this.menuOpen.set(true);
      this.lockScroll();
    }
  }

  protected closeMenu(): void {
    this.closeWithAnimation();
  }

  private closeWithAnimation(): void {
    this.closing.set(true);
    setTimeout(() => {
      this.menuOpen.set(false);
      this.closing.set(false);
      this.unlockScroll();
    }, 400);
  }

  private lockScroll(): void {
    document.body.classList.add('no-scroll');
  }

  private unlockScroll(): void {
    document.body.classList.remove('no-scroll');
  }

  private touchStartY = 0;

  protected onHandleTouchStart(event: TouchEvent): void {
    this.touchStartY = event.touches[0].clientY;
  }

  protected onHandleTouchMove(event: TouchEvent): void {
    event.preventDefault();
    const deltaY = this.touchStartY - event.touches[0].clientY;
    if (deltaY > 80) {
      this.touchStartY = 0;
      this.closeMenu();
    }
  }

  protected onHandleTouchEnd(): void {
    this.touchStartY = 0;
  }

  protected scrollTo(event: Event, id: string): void {
    event.preventDefault();
    window.location.hash = id;
    this.sectionClick.emit(id);
    this.closeMenu();
  }

  ngOnDestroy(): void {
    window.removeEventListener('hashchange', this.onHashChange);
  }
}
