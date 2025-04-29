import { Component } from '@angular/core';
import { ICart } from '../../Models/ICart';
import { CartService } from '../../Services/cart.service';
import { CommonModule } from '@angular/common';
import { ICartItem } from '../../Models/ICartItem';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cart: ICart | null = null;
  loading = false;
  errorMessage = '';

  constructor(private _cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  private loadCart(): void {
    this.loading = true;
    this._cartService.getCart().subscribe({
      next: (data) => {
        this.cart = data;
        this.errorMessage = '';
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.cart = null;
        this.loading = false;
      }
    });
  }

  getTotal(): number {
    return this.cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  }

  updateQuantity(item: ICartItem, quantity: number) {
    item.quantity = quantity;
    //  API call to update quantity in backend
  }

  removeItem(itemId: number) {
    this.cart!.items = this.cart!.items.filter(item => item.id !== itemId);
    //  API call to remove from backend
  }

  
}
