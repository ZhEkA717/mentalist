import {Pipe, PipeTransform, inject} from '@angular/core';
import {Router} from '@angular/router';
import type {HeaderItem} from './header.component';

@Pipe({
  name: 'isActive',
  standalone: true,
})
export class IsActivePipe implements PipeTransform {
  private router = inject(Router);

  transform(item: HeaderItem, activeSection: string): boolean {
    if (item.href && activeSection === item.href.slice(1)) {
      return true;
    }
    if (item.route && !activeSection) {
      const url = this.router.url.split('?')[0].split('#')[0];
      if (url === item.route) return true;
    }
    return false;
  }
}