import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, retry, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorHandlerService } from '../../../core/services/http-error-handler.service';
import { IFood } from '../../home/models/IFood';
import { ICartItem } from '../models/ICartItem';
import { ICartRequest } from '../models/ICartRequest';
import { ICart } from '../models/ICart';


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


  deleteCartItem(CartItemIdOrFoodId: number): Observable<void> {
    return this.authService.checkAuthStatus().pipe(
      switchMap(() => {
        // User is authenticated, delete from backend by CartItem ID
        return this.http.delete<void>(`${this.apiUrl}/items/${CartItemIdOrFoodId}`).pipe(
          tap(() => console.log('Item deleted from backend cart')),
          catchError((err) => {
            console.error('Failed to delete item from backend cart', err);
            return throwError(() => err);
          })
        );
      }),
      catchError((err) => {
        if (err.status === 401) {
          // Guest user: delete from localStorage by foodId
          const cart = this.getCartFromLocalStorage(); 

          const updatedCart = cart.filter(item => item.foodId !== CartItemIdOrFoodId);

          localStorage.setItem(this.cartKey, JSON.stringify(updatedCart));

          console.log('Item deleted from localStorage cart');
          return of(undefined); // Return empty observable on success for guest user
        } else {
          console.error('Error checking auth status:', err);
          return throwError(() => err);
        }
      })
    );
  }


  updateCartItem(cartItem: ICartItem): Observable<void> {
    return this.authService.checkAuthStatus().pipe(
      switchMap(() => {
        
        return this.http.patch<void>(`${this.apiUrl}/items/${cartItem.id}`, cartItem.quantity).pipe(
          tap(() => console.log('Item updated in backend cart')),
          catchError((err) => {
            console.error('Failed to update item in backend cart', err);
            return throwError(() => err);
          })
        );
      }),
      catchError((err) => {
        if (err.status === 401) {
         
          const cart = this.getCartFromLocalStorage();
          const index = cart.findIndex(item => item.foodId === cartItem.food.id);
  
          if (index > -1) {
            cart[index].quantity = cartItem.quantity;
            localStorage.setItem(this.cartKey, JSON.stringify(cart));
            console.log('Item updated in localStorage cart');
          }
          return of(undefined); // Return empty observable on success for guest user
        } else {
          console.error('Error checking auth status:', err);
          return throwError(() => err);
        }
      })
    );
  }
  
  
  
}
