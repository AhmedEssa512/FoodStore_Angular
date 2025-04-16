import { inject } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { IAuthRespone } from '../Models/IAuthRespone';
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



// Shared state across requests
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);


export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const http = inject(HttpClient);

  // Skip adding token to login or refresh calls
  if (req.url.includes('/login') || req.url.includes('/refresh'))
  {
    return next(req);
  }

  const token = authService.getToken();
  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(req, next, authService, http);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService,
  http: HttpClient
): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      tap((res) => {
        refreshTokenSubject.next(res.token);
      }),
      switchMap((res) => {
        const retryReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${res.token}`,
          },
        });
        return next(retryReq);
      }),
      catchError((err) => {
        authService.logout(); 
        return throwError(() => err);
      }),
      finalize(() => {
        isRefreshing = false;
      })
    );
  } 
  else  // If refresh is already happening, wait for it to finish
   { 
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        const retryReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token!}`,
          },
        });
        return next(retryReq);
      })
    );
  }
};
