import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, switchMap, tap } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { CartItem } from '../models/CartItem';
import { CartRequest } from '../models/CartRequest';
import { Cart } from '../models/Cart';
import { GuestCartService } from './guest-cart.service';
import { BackendCartService } from './backend-cart.service';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemCount = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCount.asObservable();

  constructor(
    private authService: AuthService,
    private backendCart: BackendCartService,
    private guestCart: GuestCartService,
  ) {}


  getCart(): Observable<Cart> {
    return this.authService.checkAuthStatus().pipe(
      map(result => result.isAuthenticated),
      switchMap(isAuth => isAuth ? this.backendCart.getCart() : this.guestCart.getCart()),
      tap(cart => this.cartItemCount.next(cart.items.length)),
    );
  }


  addToCart(item: CartRequest): Observable<void> {
    return this.authService.getAuthStatusOnce().pipe(
      switchMap(isAuth => isAuth ? this.backendCart.addItem(item) : this.guestCart.addItem(item)),
      switchMap(() => this.getCart()), // Refetch the full cart
      tap(cart => this.cartItemCount.next(this.calculateTotalCount(cart))),
      map(() => void 0)
    );
  }

  updateCartItem(item: CartItem): Observable<void> {
    return this.authService.getAuthStatusOnce().pipe(
      switchMap(isAuth => isAuth ? this.backendCart.updateItem(item) : this.guestCart.updateItem(item)),
      switchMap(() => this.getCart()),
      tap(cart => this.cartItemCount.next(this.calculateTotalCount(cart))),
      map(() => void 0)
    );
  }

  deleteCartItem(id: number): Observable<void> {
    return this.authService.getAuthStatusOnce().pipe(
      switchMap(isAuth => isAuth ? this.backendCart.deleteItem(id) : this.guestCart.deleteItem(id)),
      switchMap(() => this.getCart()),
      tap(cart => this.cartItemCount.next(this.calculateTotalCount(cart))),
      map(() => void 0)
    );
  }

  // mergeGuestCartToBackend(): Observable<void> {
  //   return this.backendCart.mergeGuestCart(this.guestCart.getRawCart());
  // }

  mergeGuestCartToBackend(): Observable<void> {
  return this.backendCart.mergeGuestCart(this.guestCart.getRawCart()).pipe(
    switchMap(() => this.backendCart.getCart()), // Refresh the backend cart after merge
    tap(cart => {
      this.cartItemCount.next(this.calculateTotalCount(cart));
      this.guestCart.clearCart(); // Clear guest cart after successful merge
    }),
    map(() => void 0)
  );
}

  loadInitialCart(): Observable<void> {
  return this.authService.checkAuthStatus().pipe(
    switchMap(res => res.isAuthenticated ? this.backendCart.getCart() : this.guestCart.getCart()),
    tap(cart => {
      this.cartItemCount.next(this.calculateTotalCount(cart));
    }),
    map(() => void 0)
  );
}

private calculateTotalCount(cart: Cart): number {
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}


}
