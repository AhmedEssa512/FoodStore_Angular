import { Food } from "../../home/models/Food";


export interface CartItem
{
  id: number;
  quantity: number;
  price: number;
  // cartId: number;
  food: Food;
}