import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../modules/landing/pages/landing/landing.component').then(m => m.LandingComponent),
    pathMatch: 'full'
  }
];
