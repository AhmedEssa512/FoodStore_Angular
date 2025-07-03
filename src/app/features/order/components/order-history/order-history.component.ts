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
    // Mock data, replace with real API call
    this.loadOrders();
  }


  loadOrders(): void {
    this.orderService.getOrders().subscribe(
      (data: OrderSummary[]) => {
        this.orders = data;
      },
      (error) => {
        console.error('Error fetching orders in component:', error);
        this.errorMessage = 'Failed to load orders. Please try again later.';
      }
    );
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/orders', orderId]);  // Navigate to order details with order ID
  }



  reorder(orderId: number) {
    console.log('Reorder', orderId);
    // Add order items again to cart
  }

  trackOrder(orderId: number) {
    console.log('Track order', orderId);
    // Navigate to tracking page or open tracking modal
  }

  rateOrder(orderId: number) {
    console.log('Rate order', orderId);
    // Open rating dialog/modal
  }

  goToShop() {
    console.log('Navigate to shop');
    // Navigate to shopping/catalog page
  }

  
}
