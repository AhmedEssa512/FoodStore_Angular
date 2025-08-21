import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResponse } from '../../../../../shared/models/paginated-response.model';
import { Observable } from 'rxjs';
import { ProductAdminList } from '../models/ProductAdminList';
import { FoodFormData } from '../models/FoodFormData';
import { ProductResponse } from '../models/ProductResponse ';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
private apiUrl = environment.apiUrl + '/food';

  constructor(private http: HttpClient) { }

getProducts(params: {
      categoryId?: number;
      pageNumber?: number;
      pageSize?: number;
    } = {}): Observable<PaginatedResponse<ProductAdminList>> {
      const httpParams = new HttpParams({ fromObject: { 
        ...(params.categoryId != null ? { categoryId: params.categoryId.toString() } : {}),
        ...(params.pageNumber ? { pageNumber: params.pageNumber.toString() } : {}),
        ...(params.pageSize ? { pageSize: params.pageSize.toString() } : {})
      }});
    
      return this.http.get<PaginatedResponse<ProductAdminList>>(`${this.apiUrl}/Admin-Foods`, { params: httpParams });
    }

    
createProduct(food: FoodFormData): Observable<ProductResponse> {
  const formData = new FormData();
  formData.append('Name', food.name);
  formData.append('Description', food.description);
  formData.append('Price', food.price.toString());
  formData.append('CategoryId', food.categoryId.toString());
  formData.append('file', food.file);

  return this.http.post<ProductResponse>(this.apiUrl, formData);
}


updateProduct(id: number, food: FoodFormData): Observable<ProductResponse> {
  const formData = new FormData();
  formData.append('Name', food.name);
  formData.append('Description', food.description);
  formData.append('Price', food.price.toString());
  formData.append('CategoryId', food.categoryId.toString());
  if (food.file) {
    formData.append('file', food.file);
  }

  return this.http.put<ProductResponse>(`${this.apiUrl}/${id}`, formData);
}


getProductById(id: number): Observable<ProductResponse> {
  return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`);
}

deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

toggleAvailability(id: number, isAvailable: boolean) : Observable<void>{
  return this.http.patch<void>(`${this.apiUrl}/${id}/availability`, isAvailable);
}
}
