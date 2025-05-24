import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import { AuthInterceptor } from './app/services/auth.interceptor';
import { LoadingService }  from './app/services/loading.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

bootstrapApplication(AppComponent, {
  providers: [
    // 1) habilita as animações do Material (necessário para muitos componentes)
    provideAnimations(),

    // 2) importa módulos NgModule em providers (HttpClient + BrowserAnimations)
    importProvidersFrom(
      HttpClientModule,
      BrowserAnimationsModule,
      MatDialogModule,
      MatIconModule
    ),

    // 3) mantém suas rotas e demais providers vindos de appConfig
    ...appConfig.providers,

    // 4) seu interceptor de autenticação
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

    // 5) seu serviço de loading
    LoadingService
  ]
})
.then(() => {
  const loader = document.getElementById('global-loader');
  if (loader) loader.remove();
})
.catch(err => console.error(err));
