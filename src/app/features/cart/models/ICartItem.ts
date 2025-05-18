import { IFood } from "../../home/models/IFood";


export interface ICartItem
{
  id: number;
  quantity: number;
  price: number;
  // cartId: number;
  food: IFood;
}