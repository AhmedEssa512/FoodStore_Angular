import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, finalize, map, Observable, of, take, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthRespone } from '../../features/auth/models/AuthRespone';
import { LoginRequest } from '../../features/auth/models/LoginRequest';
import { RegisterRequest } from '../../features/auth/models/RegisterRequest';
import { HttpErrorHandlerService } from './http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7268/api/Auth';
  

  // BehaviorSubject tracks login status
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<boolean>(false);

  constructor(
     private http: HttpClient,
     private router: Router,
     private errorHandler: HttpErrorHandlerService,
    ) {}

  login(loginRequest: LoginRequest): Observable<AuthRespone> {
    return this.http.post<AuthRespone>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap((res) => {

        this.isLoggedInSubject.next(true);

        return res;
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError(() => error);
      })
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
  
    return this.http.post<void>(`${this.apiUrl}/refresh-token`,{}).pipe(
      tap(() => {
        this.isLoggedInSubject.next(true);
        this.refreshTokenSubject.next(true); 
      }),
      catchError(error => {
        this.logout();
        this.refreshTokenSubject.next(false); 
        return throwError(() => error);
      }),
      finalize(() => {
        this.isRefreshing = false;
      })
    );
  }

  logout():void {
    this.http.post(`${this.apiUrl}/revoke-token`,{}).pipe(
      catchError((res) => of(null))   
    ).subscribe((res) => {
      this.isLoggedInSubject.next(false);
      this.router.navigate(['/login']);
    });
  }


  checkAuthStatus(): Observable<{ isAuthenticated: boolean }> {
    return this.http.get<{ isAuthenticated: boolean }>(`${this.apiUrl}/is-authenticated`);
  }

  initializeLoginStatus(): void {
  this.checkAuthStatus().pipe(
    catchError(() => of({ isAuthenticated: false }))
  ).subscribe((res) => {
    this.isLoggedInSubject.next(res.isAuthenticated);
  });
}

isLoggedIn(): boolean {
  return this.isLoggedInSubject.value;
}

register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      catchError(this.errorHandler.handleError)
    );
  }

}
