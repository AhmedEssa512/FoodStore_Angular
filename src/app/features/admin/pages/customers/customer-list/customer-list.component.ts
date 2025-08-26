import { Component, OnInit } from '@angular/core';
import { PaginatedResponse } from '../../../../../shared/models/paginated-response.model';
import { CustomerService } from '../services/customer.service';
import { CustomerList } from '../models/CustomerList';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { UpdateUserStatus } from '../models/UpdateCustomerStatus';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule,PaginationComponent, FormsModule],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent implements OnInit{

  customers: CustomerList[] = [];

  isLoading:boolean = false;
  search: string = '';

  pagination : Omit<PaginatedResponse<CustomerListComponent>, 'items'> = {
    pageNumber: 1,
    pageSize: 9,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  };

  constructor(
    private customerService: CustomerService,
  )
  {}

  ngOnInit(): void {
    this.loadCustomers();
  }

    loadCustomers(): void {
    this.isLoading = true;

    this.customerService.getAll({
      pageNumber: this.pagination.pageNumber,
      pageSize: this.pagination.pageSize,
      search: this.search

    }).subscribe({
      next: (res) => {
        this.customers = res.items;
        this.pagination = {
          pageNumber: res.pageNumber,
          pageSize: res.pageSize,
          totalCount: res.totalCount,
          totalPages: res.totalPages,
          hasPreviousPage: res.hasPreviousPage,
          hasNextPage: res.hasNextPage
        };
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }


 updateStatus(customer: CustomerList): void {
  const dto: UpdateUserStatus = {
    isActive: !customer.isActive, // toggle current status
    suspensionEnd: null           // later extend to set suspension date
  };

  this.customerService.updateStatus(customer.id, dto).subscribe({
    next: () => {
      customer.isActive = !customer.isActive; 
    },
    error: (err) => {
      console.error('Failed to update status', err);
    }
  });
}

  // deleteCustomer(id:string){

  // }

  //  viewCustomer(id:string){

  // }

 onPageChange(page: number): void {
  this.pagination.pageNumber = page;
  this.loadCustomers();
}

}
