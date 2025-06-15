import { CartItem } from "./CartItem";


export interface Cart {
    id: number;
    userId: string;
    items: CartItem[];
    total: number;
  }