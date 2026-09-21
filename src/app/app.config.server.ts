import {mergeApplicationConfig, ApplicationConfig, signal} from '@angular/core';
import {provideServerRendering, withRoutes} from '@angular/ssr';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {TUI_REDUCED_MOTION, TUI_BREAKPOINT, TUI_DARK_MODE} from '@taiga-ui/core/tokens';
import {appConfig} from './app.config';
import {serverRoutes} from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideNoopAnimations(),
    {provide: TUI_REDUCED_MOTION, useValue: false},
    {provide: TUI_BREAKPOINT, useValue: signal('desktopLarge')},
    {provide: TUI_DARK_MODE, useValue: signal(true)},
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
