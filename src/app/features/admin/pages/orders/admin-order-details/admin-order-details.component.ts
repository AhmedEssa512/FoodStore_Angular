import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Order } from '../../../../order/models/Order';
import { OrderService } from '../../../../order/services/order.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-order-details.component.html',
  styleUrl: './admin-order-details.component.css'
})
export class AdminOrderDetailsComponent implements OnInit{
  order: Order | null = null;
  errorMessage = '';

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
  )
  {}

 ngOnInit(): void {
    const orderId = +this.route.snapshot.paramMap.get('id')!;
    this.loadOrderDetails(orderId);
  }

  loadOrderDetails(orderId: number): void {
    this.orderService.getOrderById(orderId).subscribe({
      next: (data) => (this.order = data),
      error: (err) => (this.errorMessage = err)
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/orders']);
  }
}
