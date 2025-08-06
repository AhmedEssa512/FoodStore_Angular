import { APP_INITIALIZER, ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { loaderInterceptor } from './core/interceptors/loader.interceptor';
import { AuthService } from './core/services/auth.service';
import { CartService } from './features/cart/services/cart.service';
import { firstValueFrom, switchMap } from 'rxjs';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { unwrapApiResponseInterceptor } from './core/interceptors/unwrap-api-response.interceptor';

export function appInitializer() {
  const authService = inject(AuthService);
  const cartService = inject(CartService);

  return () => firstValueFrom(
    authService.initializeLoginStatus().pipe(
      switchMap(() => cartService.loadInitialCart())
    )
  );
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
      useFactory: appInitializer,
      multi: true
    }
  ]
};
