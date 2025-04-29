import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { catchError, Observable, retry } from 'rxjs';
import { ICart } from '../Models/ICart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly apiUrl = 'https://localhost:7268/api/Cart';

  constructor(
      private http: HttpClient,
      private errorHandler: HttpErrorHandlerService
    
  ) { }

  getCart(): Observable<ICart> {
    return this.http.get<ICart>(`${this.apiUrl}/items`)
      .pipe(
        retry(2),
        catchError(this.errorHandler.handleError)
      );
  }
  
}
