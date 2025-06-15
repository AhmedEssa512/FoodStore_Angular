import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Food } from '../models/Food';
import { PaginatedResponse } from '../../../shared/models/paginated-response.model';



@Injectable({
  providedIn: 'root'
})
export class FoodService {

  private baseUrl = 'https://localhost:7268/api/Food';

  constructor(private http:HttpClient) { }

  getFoods(params: {
    categoryId?: number;
    pageNumber?: number;
    pageSize?: number;
  } = {}): Observable<PaginatedResponse<Food>> {
    const httpParams = new HttpParams({ fromObject: { 
      ...(params.categoryId != null ? { categoryId: params.categoryId.toString() } : {}),
      ...(params.pageNumber ? { pageNumber: params.pageNumber.toString() } : {}),
      ...(params.pageSize ? { pageSize: params.pageSize.toString() } : {})
    }});
  
    return this.http.get<PaginatedResponse<Food>>(`${this.baseUrl}`, { params: httpParams });
  }
}
