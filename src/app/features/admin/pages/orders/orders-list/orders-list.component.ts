import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrderSummary } from '../../../../order/models/OrderSummary';
import { PaginatedResponse } from '../../../../../shared/models/paginated-response.model';
import { RouterLink } from '@angular/router';
import { AdminOrdersService } from '../services/admin-orders.service';
import { OrderQuery } from '../models/OrderQuery';
import { PaginationComponent } from "../../../../../shared/components/pagination/pagination.component";
import { FormsModule } from '@angular/forms';
import { DateRangeFilterComponent } from '../../../../../shared/components/date-range-filter/date-range-filter.component';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginationComponent, DateRangeFilterComponent, FormsModule],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.css'
})
export class OrdersListComponent implements OnInit{

orders: OrderSummary[] = [];
pagination : Omit<PaginatedResponse<OrderSummary>, 'items'> = {
  pageNumber: 1,
  pageSize: 9,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false
};

currentFilter: { startDate?: string; endDate?: string } = {};

constructor(
  private orderService: AdminOrdersService,
)
{}

ngOnInit(): void {
  this.getOrders();
}



getOrders(): void {
  const query: OrderQuery = {
    pageNumber: this.pagination.pageNumber,
    pageSize: this.pagination.pageSize,
    startDate: this.currentFilter.startDate || '',
    endDate: this.currentFilter.endDate || ''
  };

  this.orderService.getOrders(query).subscribe({
    next: (res) => {
      this.orders = res.items;
      this.pagination = {
        pageNumber: res.pageNumber,
        pageSize: res.pageSize,
        totalCount: res.totalCount,
        totalPages: res.totalPages,
        hasPreviousPage: res.hasPreviousPage,
        hasNextPage: res.hasNextPage
      };
    },
    error: (err) => {
      console.error('Failed to load orders', err);
    }
  });
}

updateStatus(orderId: number, newStatus: string): void {
  this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
    next: (updatedOrder) => {
      // Update in local orders list
      const index = this.orders.findIndex(o => o.id === orderId);
      if (index !== -1) {
        this.orders[index].status = updatedOrder.status;
      }
    },
    error: (err) => {
      console.error('Failed to update order status', err);
    }
  });
}

onDateFilter(filter: { startDate?: string; endDate?: string }) {
  this.currentFilter = filter;
  this.pagination.pageNumber = 1; 
  this.getOrders();
}

 onPageChange(page: number): void {
  this.pagination.pageNumber = page;
  this.getOrders();
}

}
