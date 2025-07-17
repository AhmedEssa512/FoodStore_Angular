import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Category } from '../models/Category';
import { HttpErrorHandlerService } from '../../../core/services/http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly baseUrl = 'https://localhost:7268/api/categories';

  constructor(
    private http: HttpClient,
    private errorHandler: HttpErrorHandlerService,
  ) { }

 getCategories(): Observable<Category[]> {
  return this.http.get<Category[]>(`${this.baseUrl}`).pipe(
    catchError(err => {
      console.error('Error fetching categories:', err);
      return this.errorHandler.handleError(err);
    })
  );
}


}
