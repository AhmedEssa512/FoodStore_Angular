import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { throwError } from 'rxjs';

import {
  HttpInterceptorFn,
  HttpErrorResponse,
} from '@angular/common/http';

import {
  catchError,
  switchMap,
} from 'rxjs/operators';


export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);

  const clonedReq = req.clone({ withCredentials: true });

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {

      // Skip refresh token calling
      const authEndpoints = ['/login', '/register', '/refresh-token', '/revoke-token'];
      const isAuthRequest = authEndpoints.some(url => req.url.includes(url));

  
      if (error.status === 401 && !isAuthRequest) {
        
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Retry the original request
            return next(clonedReq);
          }),
          catchError(refreshError => {
            authService.logout().subscribe();
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );

  
};
