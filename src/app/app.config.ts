import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideTaiga, tuiCommonIconsProvider } from '@taiga-ui/core';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideTaiga({ mode: 'dark' }),
    tuiCommonIconsProvider({
      close: '',
      check: '',
    }),
  ]
};
