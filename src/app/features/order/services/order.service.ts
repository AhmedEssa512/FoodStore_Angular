import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpErrorHandlerService } from '../../../core/services/http-error-handler.service';
import { AuthService } from '../../../core/services/auth.service';
import { CreateOrder } from '../models/CreateOrder ';
import { catchError, Observable, of, throwError } from 'rxjs';
import { OrderResponse } from '../models/OrderResponse';
import { OrderSummary } from '../models/OrderSummary';
import { Order } from '../models/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'https://localhost:7268/api/order';

  constructor(
      private http: HttpClient,
      private errorHandler: HttpErrorHandlerService,
  ) { }

 createOrder(order: CreateOrder): Observable<OrderResponse> {
  return this.http.post<OrderResponse>(this.apiUrl, order).pipe(
    
    catchError(err => this.errorHandler.handleError(err))
  );
}

getOrders(): Observable<OrderSummary[]> {
    return this.http.get<OrderSummary[]>(this.apiUrl).pipe(
      catchError(error => {
        this.errorHandler.handleError(error);  
        return of([]);  // Return an empty array as fallback
      })
    );
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => this.errorHandler.handleError(error))  
    );
  }

}


