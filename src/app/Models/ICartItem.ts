import { IFood } from "./IFood";

export interface ICartItem
{
  id: number;
  quantity: number;
  price: number;
  cartId: number;
  foodId: number;
  food: IFood;
}