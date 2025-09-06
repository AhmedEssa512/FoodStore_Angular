import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cart } from '../models/Cart';
import { Observable } from 'rxjs';
import { CartRequest } from '../models/CartRequest';
import { CartItem } from '../models/CartItem';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendCartService {
    private apiUrl: string = environment.apiUrl;

  constructor(
     private http: HttpClient,
    ){}  
    

getCart(): Observable<Cart> {
  return this.http.get<Cart>(`${this.apiUrl}/cart/items`);
}

addItem(item: CartRequest): Observable<void> {
  return this.http.post<void>(`${this.apiUrl}/cart/items`, item);
}

deleteItem(itemId: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/cart/items/${itemId}`);
}

updateItem(cartItem: CartItem): Observable<void> {
  return this.http.patch<void>(`${this.apiUrl}/cart/items/${cartItem.id}`, { quantity: cartItem.quantity } );
}

mergeGuestCart(guestCart: CartRequest[]): Observable<void> {
  return this.http.post<void>(`${this.apiUrl}/cart/merge`, guestCart);
}

}
