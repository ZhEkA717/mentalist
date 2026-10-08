import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Router} from '@angular/router';
import {initRevealOnScroll} from '../../utils/scroll-animations';
import {killGsapTweens} from '../../utils/gsap';
import type {ScrollTrigger} from '../../utils/gsap';

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
export class CombinationProgramComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  private triggers: ScrollTrigger[] = [];

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

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    void initRevealOnScroll(this.el.nativeElement).then((triggers) => {
      this.triggers.push(...triggers);
    });
    this.destroyRef.onDestroy(() => {
      this.triggers.forEach((t) => t.kill());
      killGsapTweens(this.el.nativeElement.querySelectorAll('.reveal-on-scroll'));
    });
  }

  ngOnDestroy(): void {
    this.triggers.forEach((t) => t.kill());
    if (isPlatformBrowser(this.platformId)) {
      killGsapTweens(this.el.nativeElement.querySelectorAll('.reveal-on-scroll'));
    }
  }

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
