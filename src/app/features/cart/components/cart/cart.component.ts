import { Component } from '@angular/core';
import { Cart } from '../../models/Cart';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../models/CartItem';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cart: Cart | null = null;
  loading = false;
  errorMessage = '';

  constructor(private cartService: CartService,private authService:AuthService) {}

  ngOnInit(): void {
    this.loadCart();
  }

 private loadCart(): void {
  
 const cartObservable = this.authService.isLoggedIn()
    ? this.cartService.getCartForAuthenticatedUser()
    : this.cartService.getCartForGuestUser();

  cartObservable.subscribe({
    next: cart => this.cart = cart,
    error: err => this.errorMessage = err.message || 'Failed to load cart.'
  });

}


  deleteItem(item: CartItem): void {
    const id = item.id <= 0 ? item.food.id : item.id ;
    this.cartService.deleteCartItem(id).subscribe({
    next: () => {
      console.log('Item successfully deleted');
      if(this.cart)
        {
          this.cart.items = this.cart.items.filter(i => i.food.id !== item.food.id);
        }
    },
    error: (err) => {
      console.error('Error deleting item:', err);
    }
  });
  }

  onQuantityChange(item: CartItem, newQuantity: number): void {

    const qty = +newQuantity;
    if (item.quantity === qty) return;
  
    item.quantity = qty;
  
    this.cartService.updateCartItem(item).subscribe({
      next: () => {

        if(this.cart)
        {
          this.cart.items.find(i => i.food.id === item.food.id)!.quantity = newQuantity;
        }

      },
      error: (err) => {
        console.error('Error updating item:', err);
      }
    });

  }


  getTotal(): number {
    return this.cart?.items.reduce((sum, item) => sum + item.food.price * item.quantity, 0) || 0;
  }

 
  
}
