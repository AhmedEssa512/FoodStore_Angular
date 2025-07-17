import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cart } from '../models/Cart';
import { catchError, Observable, throwError } from 'rxjs';
import { CartRequest } from '../models/CartRequest';
import { HttpErrorHandlerService } from '../../../core/services/http-error-handler.service';
import { CartItem } from '../models/CartItem';

@Injectable({
  providedIn: 'root'
})
export class BackendCartService {

  private apiUrl = 'https://localhost:7268/api/cart';

  constructor(
     private http: HttpClient,
     private errorHandler: HttpErrorHandlerService,
    ) {}

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/items`).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  addItem(item: CartRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/items`, item).pipe(
      catchError(err => throwError(() => this.errorHandler.handleError(err)))
    );
  }

  deleteItem(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${itemId}`).pipe(
      catchError(err => throwError(() => this.errorHandler.handleError(err)))
    );
  }

  updateItem(cartItem: CartItem): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/items/${cartItem.id}`, cartItem.quantity).pipe(
      catchError(err => throwError(() => this.errorHandler.handleError(err)))
    );
  }

  mergeGuestCart(guestCart: CartRequest[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/merge`, guestCart).pipe(
      catchError(err => throwError(() => this.errorHandler.handleError(err)))
    );
  }
}
