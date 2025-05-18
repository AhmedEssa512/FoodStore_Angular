import { Component } from '@angular/core';
import { ICart } from '../../models/ICart';
import { CommonModule } from '@angular/common';
import { ICartItem } from '../../models/ICartItem';
import { FormsModule } from '@angular/forms';
import { error } from 'console';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule,CommonModule],
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
        console.log(error);
        this.cart = null;
        this.loading = false;
      }
    });
  }


  deleteItem(item: ICartItem): void {
    const id = item.id <= 0 ? item.food.id : item.id ;
    this._cartService.deleteCartItem(id).subscribe({
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

  onQuantityChange(item: ICartItem, newQuantity: number): void {

    const qty = +newQuantity;
    if (item.quantity === qty) return;
  
    item.quantity = qty;
  
    this._cartService.updateCartItem(item).subscribe({
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
