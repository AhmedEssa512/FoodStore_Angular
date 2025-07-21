import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpErrorHandlerService } from '../../../core/services/http-error-handler.service';
import { CreateOrder } from '../models/CreateOrder ';
import { catchError, Observable, of } from 'rxjs';
import { OrderResponse } from '../models/OrderResponse';
import { OrderSummary } from '../models/OrderSummary';
import { Order } from '../models/Order';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl: string = environment.apiUrl;
  constructor(
      private http: HttpClient,
      private errorHandler: HttpErrorHandlerService,
  ) {}

 createOrder(order: CreateOrder): Observable<OrderResponse> {
  return this.http.post<OrderResponse>(`${this.apiUrl}/order`, order);
}

getOrders(): Observable<OrderSummary[]> {
    return this.http.get<OrderSummary[]>(`${this.apiUrl}/order`).pipe(
      catchError(error => {
        this.errorHandler.handleError(error);  
        return of([]);  // Return an empty array as fallback
      })
    );
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/order/${id}`);
  }

}


