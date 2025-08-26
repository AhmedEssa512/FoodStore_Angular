import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserQueryParams } from '../models/UserQueryParams';
import { Observable } from 'rxjs';
import { CustomerList } from '../models/CustomerList';
import { PaginatedResponse } from '../../../../../shared/models/paginated-response.model';
import { CustomerInfo } from '../models/CustomerInfo';
import { UpdateUserStatus } from '../models/UpdateCustomerStatus';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly baseUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) { }

   getAll(query: UserQueryParams): Observable<PaginatedResponse<CustomerList>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber)
      .set('pageSize', query.pageSize);

    if (query.search) {
      params = params.set('search', query.search);
    }
    if (query.isActive !== undefined) {
      params = params.set('isActive', query.isActive);
    }
    if (query.sortBy) {
      params = params.set('sortBy', query.sortBy);
    }
    if (query.descending !== undefined) {
      params = params.set('descending', query.descending);
    }

    return this.http.get<PaginatedResponse<CustomerList>>(this.baseUrl, { params });
  }

   getById(id: string): Observable<CustomerInfo> {
    return this.http.get<CustomerInfo>(`${this.baseUrl}/${id}`);
  }

  updateStatus(id: string, dto: UpdateUserStatus): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/status`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }


}
