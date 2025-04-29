import { ICartItem } from "./ICartItem";

export interface ICart {
    id: number;
    userId: string;
    items: ICartItem[];
    total: number;
  }