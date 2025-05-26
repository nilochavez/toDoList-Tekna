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
    
    provideAnimations(),

    
    importProvidersFrom(
      HttpClientModule,
      BrowserAnimationsModule,
      MatDialogModule,
      MatIconModule
    ),

    
    ...appConfig.providers,

    
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

    
    LoadingService
  ]
})
.then(() => {
  const loader = document.getElementById('global-loader');
  if (loader) loader.remove();
})
.catch(err => console.error(err));
