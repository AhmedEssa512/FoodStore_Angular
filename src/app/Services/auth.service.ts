import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoginRequest } from '../Models/ILoginRequest';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { IAuthRespone } from '../Models/IAuthRespone';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7268/api/Auth';
  private tokenKey = 'auth_token';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private _http:HttpClient) { }


  login(loginRequest:ILoginRequest): Observable<IAuthRespone> {
    return this._http.post<IAuthRespone>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap((res) => {
        this.storeToken(res.token);
        this.isLoggedInSubject.next(true);
      }),

      catchError((error) => {
      console.error('Login failed:', error);
      return throwError(() => error); // rethrow to the component for further handling
    })


    ); 
  }

  logout(): void {
    this.clearStorage();
    this.isLoggedInSubject.next(false);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private clearStorage(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.tokenKey);
    }
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  private storeToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  private hasToken(): boolean {
    return this.isBrowser() && !!localStorage.getItem(this.tokenKey);
  }


}
