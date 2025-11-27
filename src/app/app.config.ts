import { APP_INITIALIZER, ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { loaderInterceptor } from './core/interceptors/loader.interceptor';
import { AuthService } from './core/services/auth.service';
import { lastValueFrom} from 'rxjs';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { unwrapApiResponseInterceptor } from './core/interceptors/unwrap-api-response.interceptor';

export function initializeApp(authService: AuthService) {
  return async () => {
    if (typeof window === 'undefined') return;

    try {
      await lastValueFrom(authService.initializeLoginStatus());
    } catch (err) {
      console.warn('Startup auth check failed', err);
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(), 
    provideHttpClient(withInterceptors([
      authInterceptor,
      loaderInterceptor,
      unwrapApiResponseInterceptor,
      httpErrorInterceptor,
    ])
  ),
    provideAnimations(),
     {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService],
      multi: true,
     }

  ]
};
