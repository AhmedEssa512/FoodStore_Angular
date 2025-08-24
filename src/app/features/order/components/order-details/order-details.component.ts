import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../models/Order';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit{
  order: Order | null = null;
  errorMessage:String = '';

  constructor(
     private route: ActivatedRoute,
     private router: Router,
     private orderService: OrderService,
  ) {}

  ngOnInit(): void {
    const orderId = +this.route.snapshot.paramMap.get('id')!;
    this.loadOrderDetails(orderId);
  }
  

   loadOrderDetails(orderId: number): void {
    this.orderService.getOrderById(orderId).subscribe(
      (data: Order) => {
        this.order = data;  
      },
      (error) => {
        this.errorMessage = error;  
      }
    );
  }

   goBack() {
    this.router.navigate(['/orders']);
  }

    
}
