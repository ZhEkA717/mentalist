import {Routes} from '@angular/router';
import {LandingComponent} from '@modules/landing/pages/landing/landing.component';
import {CorporateComponent} from '@modules/landing/pages/corporate/corporate.component';
import {NotFoundComponent} from '@modules/landing/pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'corporate',
    component: CorporateComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];