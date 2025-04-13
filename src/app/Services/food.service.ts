import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  private apiUrl = 'https://localhost:7268/api/Food/foods';

  constructor(private http:HttpClient) { }


  getFoods():Observable<any[]>
  {
    return this.http.get<any[]>(this.apiUrl);
  }
}
