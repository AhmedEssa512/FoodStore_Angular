import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FoodDetails } from '../../models/FoodDetails';
import { Food } from '../../models/Food';
import { CartRequest } from '../../../cart/models/CartRequest';
import { CartService } from '../../../cart/services/cart.service';

@Component({
  selector: 'app-food-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './food-details.component.html',
  styleUrl: './food-details.component.css'
})
export class FoodDetailsComponent {
@Input() food : Food | null = null;
@Input() isOpen = false;
@Output() closed = new EventEmitter<void>();

constructor(private cartService: CartService){}

close() {
  this.closed.emit();
}

  addToCart()
    {
      if(!this.food)  return;

      const item: CartRequest = {
        foodId: this.food.id,
        quantity: 1
      };
      this.cartService.addToCart(item).subscribe();
    }
 }
