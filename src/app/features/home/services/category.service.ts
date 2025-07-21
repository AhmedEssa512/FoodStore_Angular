import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/Category';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) {}

 getCategories(): Observable<Category[]> {
  return this.http.get<Category[]>(`${this.apiUrl}/category`);
}

}
