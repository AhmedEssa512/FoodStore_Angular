import { OrderDetail } from "./OrderDetail";

export interface Order {
  id: number;
  fullName: string;
  address: string;
  phone: string;
  createdAt: string;  
  status: string;
  total: number;
  orderDetails: OrderDetail[];
}