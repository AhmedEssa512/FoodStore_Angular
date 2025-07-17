import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CartRequest } from '../models/CartRequest';
import { CartItem } from '../models/CartItem';
import { HttpErrorHandlerService } from '../../../core/services/http-error-handler.service';
import { HttpClient } from '@angular/common/http';
import { Cart } from '../models/Cart';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { Food } from '../../home/models/Food';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GuestCartService {

  private readonly cartKey = 'guest_cart';
  private readonly foodIdsUrl = 'https://localhost:7268/api/Food';
  private isBrowser: boolean;
   

  constructor(private http: HttpClient, private errorHandler: HttpErrorHandlerService, @Inject(PLATFORM_ID) platformId: Object) {
     this.isBrowser = isPlatformBrowser(platformId);
  }

  getCart(): Observable<Cart> {
    const localItems = this.getFromLocalStorage();
    const foodIds = localItems.map(i => i.foodId);

    if (foodIds.length === 0) {
      return of({ id: 0, userId: '', items: [], total: 0 });
    }

    return this.http.post<Food[]>(`${this.foodIdsUrl}/batch`, foodIds).pipe(
      map((foods) => {
        const items = foods.map(food => {
          const matching = localItems.find(i => i.foodId === food.id);
          const quantity = matching?.quantity ?? 1;
          return {
            id: 0,
            cartId: 0,
            foodId: food.id,
            quantity,
            price: food.price * quantity,
            food
          } as CartItem;
        });

        const total = items.reduce((sum, item) => sum + item.price, 0);
        return { id: 0, userId: '', items, total };
      }),
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  addItem(item: CartRequest): Observable<void> {
    const cart = this.getFromLocalStorage();
    const existing = cart.find(i => i.foodId === item.foodId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cart.push(item);
    }
    this.saveToLocalStorage(cart);
    this.updateItemCount();
    console.log('Item added to guest cart');
    return of(void 0);
  }

  deleteItem(foodId: number): Observable<void> {
    const cart = this.getFromLocalStorage().filter(i => i.foodId !== foodId);
    this.saveToLocalStorage(cart);
    this.updateItemCount();
    console.log('Item deleted from guest cart');
    return of(void 0);
  }

  updateItem(cartItem: CartItem): Observable<void> {
    const cart = this.getFromLocalStorage();
    const index = cart.findIndex(i => i.foodId === cartItem.food.id);
    if (index > -1) {
      cart[index].quantity = cartItem.quantity;
      this.saveToLocalStorage(cart);
      this.updateItemCount();
      console.log('Guest cart item updated');
    }
    return of(void 0);
  }

  clearCart(): Observable<void> {
    if (this.isBrowser) {
    localStorage.removeItem(this.cartKey);
    this.updateItemCount();
  }
    return of(void 0);
  }

  getRawCart(): CartRequest[] {
    return this.getFromLocalStorage();
  }

  private getFromLocalStorage(): CartRequest[] {
    if (!this.isBrowser) {
      return [];
    }
    return JSON.parse(localStorage.getItem(this.cartKey) || '[]');
  }

  private saveToLocalStorage(cart: CartRequest[]): void {
    if (!this.isBrowser) return;

    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  }

  private updateItemCount(): void {
    if (!this.isBrowser) return;

    const cart = this.getFromLocalStorage();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  }
}
