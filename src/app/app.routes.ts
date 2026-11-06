import {Routes} from '@angular/router';
import {LandingComponent} from '@modules/landing/pages/landing/landing.component';
import {CorporateComponent} from '@modules/landing/pages/corporate/corporate.component';
import {NotFoundComponent} from '@modules/landing/pages/not-found/not-found.component';
import {WeddingComponent} from '@modules/landing/pages/wedding/wedding.component';
import {PrivateEventComponent} from '@modules/landing/pages/private-event/private-event.component';

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
    path: 'wedding',
    component: WeddingComponent,
  },
  {
    path: 'private-event',
    component: PrivateEventComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
