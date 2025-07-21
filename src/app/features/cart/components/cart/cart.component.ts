import { Component } from '@angular/core';
import { Cart } from '../../models/Cart';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../models/CartItem';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { Observable } from 'rxjs';

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

  constructor(
    private cartService: CartService,
  ){}

  ngOnInit(): void {
    this.loadCart();
  }

 private loadCart(): void {
  this.loading = true;
  this.cartService.getCart().subscribe({
     next: cart => {
        this.cart = cart;
        this.loading = false;
        console.log(cart);
      },
    error: err => {
        this.errorMessage = err.message;
        this.loading = false;
      }
  });

}


  deleteItem(item: CartItem): void {
    const id = item.id <= 0 ? item.food.id : item.id;

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
      this.errorMessage = err.message;
    }
  });
  }

  onQuantityChange(item: CartItem, newQuantity: number): void {
    const qty = +newQuantity;
    if (item.quantity === qty) return;

    const updatedItem = { ...item, quantity: qty };

    this.cartService.updateCartItem(updatedItem).subscribe({
      next: () => {
        if (this.cart) {
          const existingItem = this.cart.items.find(i => i.food.id === item.food.id);
          if (existingItem) existingItem.quantity = qty;
        }
      },
      error: err => {
        console.error('Error updating item:', err);
        this.errorMessage = err.message;
      }
    });
  }


  getTotal(): number {
    return this.cart?.items.reduce((sum, item) => sum + item.food.price * item.quantity, 0) || 0;
  }

 
  
}
