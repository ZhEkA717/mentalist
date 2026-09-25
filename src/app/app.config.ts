import {ApplicationConfig, provideBrowserGlobalErrorListeners, signal} from '@angular/core';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {provideTaiga, tuiCommonIconsProvider} from '@taiga-ui/core';
import {TUI_LANGUAGE} from '@taiga-ui/i18n';
import {TUI_RUSSIAN_LANGUAGE} from '@taiga-ui/i18n/languages/russian';

import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideTaiga({mode: 'dark'}),
    tuiCommonIconsProvider({
      close: '',
      check: '',
    }),
    {provide: TUI_LANGUAGE, useValue: signal(TUI_RUSSIAN_LANGUAGE)},
  ]
};
