import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFood } from '../Models/IFood';

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
  } = {}): Observable<IFood[]> {
    const httpParams = new HttpParams({ fromObject: { 
      ...(params.categoryId != null ? { categoryId: params.categoryId.toString() } : {}),
      ...(params.pageNumber ? { pageNumber: params.pageNumber.toString() } : {}),
      ...(params.pageSize ? { pageSize: params.pageSize.toString() } : {})
    }});
  
    return this.http.get<IFood[]>(`${this.baseUrl}/foods`, { params: httpParams });
  }
}
