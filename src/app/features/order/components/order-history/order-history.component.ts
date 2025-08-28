import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { OrderSummary } from '../../models/OrderSummary';
import { Router } from '@angular/router';



@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {
 orders: OrderSummary[] = [];
 errorMessage: string = '';

   constructor(private orderService:OrderService, private router: Router ){}

  ngOnInit() {
    this.loadOrders();
  }


    loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next:(data: OrderSummary[]) =>{
        this.orders = data;
      },
      error:(err) =>{
        console.error('Error fetching orders in component:', err);
        this.errorMessage = err.message;
      }
    })
      
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/orders', orderId]);    
  }

 goToShop() {
    this.router.navigate(['/home']);
  }

  
}
