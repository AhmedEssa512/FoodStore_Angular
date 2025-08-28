import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalesByCategoryReport } from '../models/SalesByCategoryReport';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private readonly baseUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) { }

   getSalesByCategory(): Observable<SalesByCategoryReport[]> {
    return this.http.get<SalesByCategoryReport[]>(
      `${this.baseUrl}/sales-by-category`
    );
  }

  exportSalesByCategoryExcel(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/sales-by-category/excel`, {
      responseType: 'blob'
    });
  }

  exportSalesByCategoryPdf(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/sales-by-category/pdf`, {
      responseType: 'blob'
    });
  }
}
