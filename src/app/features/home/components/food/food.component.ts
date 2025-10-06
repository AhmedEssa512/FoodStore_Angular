import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Food } from '../../models/Food';
import { CartService } from '../../../cart/services/cart.service';
import { CartRequest } from '../../../cart/models/CartRequest';


@Component({
  selector: 'app-food',
  standalone: true,
  imports: [],
  templateUrl: './food.component.html',
  styleUrl: './food.component.css'
})
export class FoodComponent {
  @Input() food: any | undefined;

  @Output() viewDetails = new EventEmitter<Food>();

  constructor(private cartService:CartService){}

  addToCart()
  {
    const item: CartRequest = {
      foodId: this.food.id,
      quantity: 1
    };
    console.log(item.foodId);
    this.cartService.addToCart(item).subscribe();
  }

  openDetails() {
    this.viewDetails.emit(this.food);
  }

}
