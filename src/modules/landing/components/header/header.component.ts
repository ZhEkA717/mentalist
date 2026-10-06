import {ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnDestroy, output, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Router} from '@angular/router';
import {DrawerComponent} from '../drawer/drawer.component';
import {IsActivePipe} from './header-is-active.pipe';

export interface HeaderItem {
  label: string;
  href?: string;
  route?: string;
  block?: ScrollLogicalPosition;
  offset?: number;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [DrawerComponent, IsActivePipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  items = input.required<HeaderItem[]>();
  sectionClick = output<{id: string; block: ScrollLogicalPosition; offset: number}>();

  menuOpen = signal(false);
  activeSection = signal('');

  private onHashChange = () => {
    if (isPlatformBrowser(this.platformId)) {
      this.activeSection.set(window.location.hash.slice(1));
    }
  };

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.activeSection.set(window.location.hash.slice(1));
      window.addEventListener('hashchange', this.onHashChange);
      inject(DestroyRef).onDestroy(() => {
        window.removeEventListener('hashchange', this.onHashChange);
      });
    }
  }

  protected toggleMenu(): void {
    this.menuOpen.set(!this.menuOpen());
  }

  protected scrollTo(event: Event, item: HeaderItem): void {
    event.preventDefault();
    this.menuOpen.set(false);

    if (item.href) {
      const id = item.href.slice(1);
      const block = item.block ?? 'start';
      const offset = item.offset ?? 0;

      if (isPlatformBrowser(this.platformId)) {
        window.location.hash = id;
      }
      this.sectionClick.emit({id, block, offset});
      return;
    }

    if (item.route) {
      void this.router.navigateByUrl(item.route);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('hashchange', this.onHashChange);
    }
  }
}