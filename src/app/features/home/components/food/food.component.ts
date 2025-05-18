import { Component, Input } from '@angular/core';
import { IFood } from '../../models/IFood';
import { CartService } from '../../../cart/services/cart.service';
import { ICartRequest } from '../../../cart/models/ICartRequest';


@Component({
  selector: 'app-food',
  standalone: true,
  imports: [],
  templateUrl: './food.component.html',
  styleUrl: './food.component.css'
})
export class FoodComponent {
  @Input() food: any | undefined;

  constructor(private cartService:CartService){}

  addToCart()
  {
    const item: ICartRequest = {
      foodId: this.food.id,
      quantity: 1
    };
    console.log(item.foodId);
    this.cartService.addToCart(item);
  }
}
