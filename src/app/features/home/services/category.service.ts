import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Category } from '../../../shared/models/Category';

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
