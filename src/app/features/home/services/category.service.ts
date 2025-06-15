import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ICategory } from '../models/ICategory';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly baseUrl = 'https://localhost:7268/api/categories';

  constructor(private http: HttpClient) { }

  getCategories() :Observable<ICategory[]>{
    return this.http.get<ICategory[]>(`${this.baseUrl}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching categories:', error);
          return throwError(() => new Error('Failed to load categories.'));
        })
      );
  }


}
