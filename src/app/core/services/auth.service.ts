import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, finalize, map, mapTo, Observable, of, switchMap, take, tap } from 'rxjs';
import { LoginRequest } from '../../features/auth/models/LoginRequest';
import { RegisterRequest } from '../../features/auth/models/RegisterRequest';
import { User } from '../../features/profile/models/User';
import { environment } from '../../../environments/environment';
import { OperationResult } from '../../features/auth/models/OperationResult ';
import { ResetPasswordRequest } from '../../features/auth/models/ResetPasswordRequest';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    
  // private apiUrl: string = environment.apiUrl;
  private apiUrl = environment.apiUrl + '/auth';

  private isLoggedInSubject = new BehaviorSubject<boolean | null>(null);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<boolean>(false); 

  constructor(
     private http: HttpClient,
    ){}

  login(loginRequest: LoginRequest): Observable<User> {
  return this.http.post<User>(`${this.apiUrl}/login`, loginRequest).pipe(
    switchMap(() =>
      this.getCurrentUser().pipe(
        tap(user => {
          this.isLoggedInSubject.next(true);
          this.currentUserSubject.next(user);
        })
      )
    )
  );
}


  refreshToken(): Observable<void> {
  if (this.isRefreshing) {
    // Another refresh is in progress, wait for it to complete
    return this.refreshTokenSubject.pipe(
      filter(status => status === true),
      take(1),
      tap(() => {
        this.isLoggedInSubject.next(true);
      }),
      map(() => void 0)
    );
  }

  this.isRefreshing = true;
  this.refreshTokenSubject.next(false);

  return this.http.post<void>(`${this.apiUrl}/refresh-token`, {}).pipe(
    tap(() => {
      this.isLoggedInSubject.next(true);
      this.refreshTokenSubject.next(true); 
    }),
    switchMap(() =>
      this.getCurrentUser().pipe(
        catchError(() => of(null)), 
        map(() => void 0) 
      )
    ),
    finalize(() => {
      this.isRefreshing = false; // Reset refresh flag
    })
  );
}


  logout(): Observable<void> {
  return this.http.post<void>(`${this.apiUrl}/revoke-token`, {}).pipe(
    tap(() => {
      this.isLoggedInSubject.next(false);
      this.currentUserSubject.next(null);
    })
  );
}


   checkAuthStatus(): Observable<{ isAuthenticated: boolean }> {
    return this.http.get<{ isAuthenticated: boolean }>(`${this.apiUrl}/is-authenticated`).pipe(
    catchError(error => {
      console.warn('Auth check failed:', error);
      return of({ isAuthenticated: false });
    })
   );
  }



initializeLoginStatus(): Observable<void> {
  return this.checkAuthStatus().pipe(
    switchMap(res => {
      this.isLoggedInSubject.next(res.isAuthenticated);

      if (res.isAuthenticated) {
        return this.getCurrentUser().pipe(
          tap(user => this.currentUserSubject.next(user)),
          mapTo(void 0)
        );
      } else {
        this.currentUserSubject.next(null);
        return of(void 0);
      }
    })
  );
}


  isLoggedIn(): boolean  {
    return this.isLoggedInSubject.value === true;
  }

  register(data: RegisterRequest): Observable<any> {
  return this.http.post(`${this.apiUrl}/register`, data);
}


  getAuthStatusOnce(): Observable<boolean> {
    return this.isLoggedIn$.pipe(
      filter((value): value is boolean => value !== null), 
      take(1)
    );
  }

  getCurrentUser(): Observable<User> {
  return this.http.get<User>(`${this.apiUrl}/me`).pipe(
    tap(user => {
      this.currentUserSubject.next(user);
    })
  );
}

  forgotPassword(email: string): Observable<OperationResult> {
    return this.http.post<OperationResult>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(data: ResetPasswordRequest): Observable<OperationResult> {
    return this.http.post<OperationResult>(`${this.apiUrl}/reset-password`, data);
  }

}
