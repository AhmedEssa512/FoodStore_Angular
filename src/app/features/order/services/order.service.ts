import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateOrder } from '../models/CreateOrder ';
import { Observable } from 'rxjs';
import { OrderResponse } from '../models/OrderResponse';
import { OrderSummary } from '../models/OrderSummary';
import { Order } from '../models/Order';
import { environment } from '../../../../environments/environment';
import { PaginatedResponse } from '../../../shared/models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl: string = environment.apiUrl;
  constructor(
      private http: HttpClient,
  ) {}

 createOrder(order: CreateOrder): Observable<OrderResponse> {
  return this.http.post<OrderResponse>(`${this.apiUrl}/order`, order);
}

getOrders(): Observable<OrderSummary[]> {
    return this.http.get<OrderSummary[]>(`${this.apiUrl}/order`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/order/${id}`);
  }

}


