import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnDestroy,
  output,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Router} from '@angular/router';
import {TuiDropdownDirective, TuiDropdownHover, TuiDropdownOptionsDirective} from '@taiga-ui/core';
import {DrawerComponent} from '../drawer/drawer.component';
import {ImagePreloadService} from '../../services/image-preload.service';
import {CORPORATE_HERO_BACKGROUNDS, CORPORATE_HERO_CHARACTERS} from '../../config/corporate-hero-assets';
import {IsActivePipe} from './header-is-active.pipe';

export interface HeaderItem {
  label: string;
  href?: string;
  route?: string;
  block?: ScrollLogicalPosition;
  offset?: number;
  children?: HeaderItem[];
  back?: boolean;
}

const SCROLL_THRESHOLD_PX = 24;
const LOGO_HIDE_THRESHOLD_PX = 240;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    DrawerComponent,
    IsActivePipe,
    TuiDropdownDirective,
    TuiDropdownHover,
    TuiDropdownOptionsDirective,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly imagePreload = inject(ImagePreloadService);
  items = input.required<HeaderItem[]>();
  sectionClick = output<{id: string; block: ScrollLogicalPosition; offset: number}>();

  menuOpen = signal(false);
  activeSection = signal('');
  isScrolled = signal(false);
  isLogoHidden = signal(false);

  private readonly timeoutIds: ReturnType<typeof setTimeout>[] = [];

  private onHashChange = () => {
    if (isPlatformBrowser(this.platformId)) {
      this.activeSection.set(window.location.hash.slice(1));
    }
  };

  private readonly onScroll = (): void => {
    if (!isPlatformBrowser(this.platformId)) return;
    const y = window.scrollY;
    this.isScrolled.set(y > SCROLL_THRESHOLD_PX);
    this.isLogoHidden.set(y > LOGO_HIDE_THRESHOLD_PX);
  };

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.activeSection.set(window.location.hash.slice(1));
      window.addEventListener('hashchange', this.onHashChange);
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('hashchange', this.onHashChange);
        window.removeEventListener('scroll', this.onScroll);
      });
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.onScroll();
    window.addEventListener('scroll', this.onScroll, {passive: true});
  }

  protected toggleMenu(): void {
    this.menuOpen.set(!this.menuOpen());
  }

  protected preloadOnHover(route?: string): void {
    if (route === '/corporate') {
      this.imagePreload.preloadResponsive(CORPORATE_HERO_BACKGROUNDS);
      this.imagePreload.preloadResponsive(CORPORATE_HERO_CHARACTERS);
    }
  }

  protected scrollTo(event: Event, item: HeaderItem): void {
    event.preventDefault();
    this.menuOpen.set(false);

    const currentRoute = this.router.url.split('?')[0].split('#')[0];

    if (item.route && item.route !== currentRoute) {
      void this.router.navigateByUrl(item.route).then((success) => {
        if (!success || !item.href || !isPlatformBrowser(this.platformId)) return;
        const id = item.href.slice(1);
        window.location.hash = id;
        this.scrollToId(id, item.block ?? 'start', item.offset ?? 0);
      });
      return;
    }

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

  private scrollToId(id: string, block: ScrollLogicalPosition, offset: number): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const tryScroll = (): boolean => {
      const el = document.getElementById(id);
      if (!el) return false;
      if (offset) {
        const y = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({top: y, behavior: 'smooth'});
      } else {
        el.scrollIntoView({behavior: 'smooth', block});
      }
      return true;
    };

    if (tryScroll()) return;

    let attempts = 0;
    const retry = (): void => {
      if (tryScroll() || ++attempts > 40) return;
      this.timeoutIds.push(setTimeout(retry, 50));
    };
    this.timeoutIds.push(setTimeout(retry, 50));
  }

  ngOnDestroy(): void {
    this.timeoutIds.forEach((id) => clearTimeout(id));
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('hashchange', this.onHashChange);
      window.removeEventListener('scroll', this.onScroll);
    }
  }
}
