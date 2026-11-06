import {ChangeDetectionStrategy, Component, inject,} from '@angular/core';
import {Router} from '@angular/router';

interface CombinationProgram {
  photo: string;
  title: string;
  subtitle: string;
  route: string;
}

@Component({
  selector: 'app-combination-program',
  imports: [],
  templateUrl: './combination-program.component.html',
  styleUrl: './combination-program.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CombinationProgramComponent {
  private readonly router = inject(Router);

  protected readonly combinationPrograms: CombinationProgram[] = [
    {
      photo: '/assets/images/combination-program/combination-program-1.png',
      title: 'welcome + сценическое шоу',
      subtitle: 'Настроить гостей на праздник и удивить весь зал.',
      route: ''
    },
    {
      photo: '/assets/images/combination-program/combination-program-2.png',
      title: 'стол менталиста + сценическое шоу',
      subtitle: 'Камерный ментализм и масштабное продолжение.',
      route: ''
    },
    {
      photo: '/assets/images/combination-program/combination-program-3.png',
      title: 'vip — полная программа',
      subtitle: 'Максимум впечатлений и насыщенная программа.',
      route: ''
    }
  ];

  protected openLink(route: string): void {
    if (!route) return;
    if (route.startsWith('#')) {
      const el = document.getElementById(route.slice(1));
      if (el) {
        el.scrollIntoView({behavior: 'smooth', block: 'start'});
        return;
      }
      window.location.hash = route;
      return;
    }
    if (/^https?:\/\//i.test(route)) {
      window.location.href = route;
      return;
    }
    void this.router.navigateByUrl(route);
  }
}
