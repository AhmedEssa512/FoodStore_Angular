import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { catchError, map, Observable, of, retry, switchMap, throwError } from 'rxjs';
import { ICart } from '../Models/ICart';
import { ICartItem } from '../Models/ICartItem';
import { AuthService } from './auth.service';
import { ICartRequest } from '../Models/ICartRequest';
import { IFood } from '../Models/IFood';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly apiUrl = 'https://localhost:7268/api/Cart';
  private readonly foodIdsUrl = 'https://localhost:7268/api/Food/getFoodByIds';
  private cartKey = 'guest_cart';

  constructor(
      private http: HttpClient,
      private errorHandler: HttpErrorHandlerService,
      private authService: AuthService
    
  ) { }

  getCart(): Observable<ICart> {
    return this.authService.checkAuthStatus().pipe(
      switchMap(() => {
        
        return this.http.get<ICart>(`${this.apiUrl}/items`);
      }),
      catchError((err) => {
        if (err.status === 401) {
          // Guest user — fallback to localStorage
          const localItems = this.getCartFromLocalStorage(); 
          const foodIds = localItems.map(i => i.foodId);
  
          if (foodIds.length === 0) {
            return of({ id: 0, userId: '', items: [], total: 0 });
          }
  
          return this.http.post<IFood[]>(`${this.foodIdsUrl}`, foodIds).pipe(
            map((foods) => {
              const items: ICartItem[] = foods.map(food => {
                const matching = localItems.find(i => i.foodId === food.id);
                const quantity = matching?.quantity ?? 1;
                return {
                  id: 0,
                  quantity,
                  price: food.price * quantity,
                  cartId: 0,
                  foodId: food.id,
                  food
                };
              });
  
              const total = items.reduce((sum, item) => sum + item.price, 0);
  
              const cart: ICart = {
                id: 0,
                userId: '',
                items,
                total
              };
  
              return cart;
            })
          );
        } else {
          // Other errors (network, server, etc.)
          console.error('Failed to get cart:', err);
          return throwError(() => err);
        }
      })
    );
  }
  
  private getCartFromLocalStorage(): { foodId: number, quantity: number }[] {
    return JSON.parse(localStorage.getItem(this.cartKey) || '[]');
  }

  addToCart(item: ICartRequest): void {
    this.authService.checkAuthStatus().subscribe({
      next: () => {

        this.http.post(`${this.apiUrl}/items`, item).subscribe({

          next: () => console.log('Item added to backend cart'),
          error: (err) => console.error('Error adding to backend cart:', err)

        });
      },
      error: (err) => {
        if (err.status === 401) {
          
          this.addToLocalCart(item);
        } else {
          console.error('Unexpected error:', err);
        }
      }
    });
  }
  
  private addToLocalCart(item: ICartRequest): void {
    const cart = JSON.parse(localStorage.getItem(this.cartKey) || '[]');
  
    const existingItem = cart.find((i: ICartRequest) => i.foodId === item.foodId);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.push(item);
    }
  
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    console.log('Item added to local cart (guest)');
  }

  mergeGuestCartToBackend(): void {
    const guestCart = this.getCartFromLocalStorage(); // [{ foodId, quantity }]
    if (guestCart.length === 0) return;
  
    this.http.post(`${this.apiUrl}/merge`, guestCart).subscribe({
      next: () => {
        console.log('Guest cart merged with backend cart.');
        localStorage.removeItem(this.cartKey);
      },
      error: (err) => {
        console.error('Failed to merge guest cart:', err);
      }
    });
  }

  deleteCartItem(cartItemIdOrFoodId: number,onSuccess?: () => void): void {
    this.authService.checkAuthStatus().subscribe({
      next: () => {
        // User is authenticated, delete from backend by CartItem ID
        this.http.delete(`${this.apiUrl}/items/${cartItemIdOrFoodId}`).subscribe({
          next: () => {
            console.log('Item deleted from backend cart')
            onSuccess?.();
          },
          
          error: (err) => console.error('Failed to delete item from backend cart', err)
        });
      },
      error: (err) => {
        if (err.status === 401) {
          // Guest user: delete from localStorage by foodId
          const cart = this.getCartFromLocalStorage(); // [{ foodId, quantity }]
          const updatedCart = cart.filter(item => item.foodId !== cartItemIdOrFoodId);
          localStorage.setItem(this.cartKey, JSON.stringify(updatedCart));
          console.log('Item deleted from localStorage cart');
          onSuccess?.();
        } else {
          console.error('Error checking auth status:', err);
        }
      }
    });
  }
  
  
  
}
