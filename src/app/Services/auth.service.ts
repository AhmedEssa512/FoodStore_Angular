import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoginRequest } from '../Models/ILoginRequest';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { IAuthRespone } from '../Models/IAuthRespone';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7268/api/Auth';
  
  private accessToken: string | null = null;

  private redirectUrl: string | null = null;

  // BehaviorSubject tracks login status
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private _http: HttpClient, private router: Router) {}

  login(loginRequest: ILoginRequest): Observable<IAuthRespone> {
    return this._http.post<IAuthRespone>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap((res) => {
        this.storeToken(res.token);
        this.isLoggedInSubject.next(true);
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
  }

  refreshToken(): Observable<IAuthRespone> {
    return this._http.post<IAuthRespone>(`${this.apiUrl}/refresh-token`, {}).pipe(
      tap((res) => {
        this.storeToken(res.token); 
      }),
      catchError((error) => {
        this.logout(); 
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this._http.post(`${this.apiUrl}/revoke-token`, {}).pipe(
      catchError(() => []) // if the request fails return an empty observable
    ).subscribe(() => {
      this.clearToken();
      this.isLoggedInSubject.next(false); 
    });
  }

  getToken(): string | null {
    return this.accessToken;
  }

   storeToken(token: string): void {
    this.accessToken = token;
  }

  private clearToken(): void {
    this.accessToken = null;
  }

  private hasToken(): boolean {
    return !!this.accessToken;
  }

  setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }

  getRedirectUrl(): string | null {
    return this.redirectUrl;
  }

  clearRedirectUrl() {
    this.redirectUrl = null;
  }


}
