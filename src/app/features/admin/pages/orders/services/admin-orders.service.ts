import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { OrderSummary } from '../../../../order/models/OrderSummary';
import { PaginatedResponse } from '../../../../../shared/models/paginated-response.model';
import { Observable } from 'rxjs';
import { OrderQuery } from '../models/OrderQuery';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminOrdersService {
   private baseUrl = environment.apiUrl + '/order';
 
   constructor(private http: HttpClient) { }

  getOrders(query: OrderQuery): Observable<PaginatedResponse<OrderSummary>> {
  let params = new HttpParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params = params.set(key, value.toString());
    }
  });

  return this.http.get<PaginatedResponse<OrderSummary>>(
    `${this.baseUrl}/orders`,
    { params }
  );
}

updateOrderStatus(orderId: number, newStatus: string) {
  return this.http.patch<OrderSummary>(
    `${this.baseUrl}/${orderId}/status`,
    { newStatus }
  );
}

}
