import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, BehaviorSubject, throwError } from 'rxjs';

import {
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpEvent,
  HttpErrorResponse,
  HttpClient,
} from '@angular/common/http';

import {
  catchError,
  switchMap,
  filter,
  take,
  tap,
  finalize,
} from 'rxjs/operators';


export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);

  const clonedReq = req.clone({ withCredentials: true });

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Skip refresh on login or auth endpoints
      const isAuthRequest = req.url.includes('/login') || req.url.includes('/register') || req.url.includes('/refresh-token');
      if (error.status === 401 && !isAuthRequest) {
        
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Retry the original request
            return next(clonedReq);
          }),
          catchError(refreshError => {
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );

  
};
