import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpErrorHandlerService } from '../../../core/services/http-error-handler.service';
import { AuthService } from '../../../core/services/auth.service';
import { CreateOrder } from '../models/CreateOrder ';
import { catchError, Observable, throwError } from 'rxjs';
import { OrderResponse } from '../models/OrderResponse';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'https://localhost:7268/api/order';

  constructor(
      private http: HttpClient,
      private errorHandler: HttpErrorHandlerService,
      private authService: AuthService
  ) { }

 createOrder(order: CreateOrder): Observable<OrderResponse> {
  return this.http.post<OrderResponse>(this.apiUrl, order).pipe(
    
    catchError(err => this.errorHandler.handleError(err))
  );
}

}
