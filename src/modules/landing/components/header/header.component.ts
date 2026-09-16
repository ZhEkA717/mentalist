import {Component, DestroyRef, inject, input, OnDestroy, output, signal} from '@angular/core';
import {DrawerComponent} from '../drawer/drawer.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [DrawerComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
  items = input.required<{ label: string; href: string }[]>();
  sectionClick = output<string>();

  menuOpen = signal(false);
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
    this.menuOpen.set(!this.menuOpen());
  }

  protected scrollTo(event: Event, id: string): void {
    event.preventDefault();
    window.location.hash = id;
    this.sectionClick.emit(id);
    this.menuOpen.set(false);
  }

  ngOnDestroy(): void {
    window.removeEventListener('hashchange', this.onHashChange);
  }
}
