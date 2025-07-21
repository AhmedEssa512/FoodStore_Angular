import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Food } from '../models/Food';
import { PaginatedResponse } from '../../../shared/models/paginated-response.model';
import { environment } from '../../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class FoodService {

  private apiUrl: string = environment.apiUrl;
  
  constructor(
    private http:HttpClient,
  ) {}

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
  
    return this.http.get<PaginatedResponse<Food>>(`${this.apiUrl}/food`, { params: httpParams });
  }

  searchFoods(query: string, pageNumber: number, pageSize: number) {
  return this.http.get<PaginatedResponse<Food>>(`${this.apiUrl}/food/search`, {
    params: {
      query,
      pageNumber,
      pageSize
    }
  });
 }

}
