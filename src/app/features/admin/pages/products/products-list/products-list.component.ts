import { Component, OnInit } from '@angular/core';
import { ProductAdminList } from '../models/ProductAdminList';
import { ProductsService } from '../services/products.service';
import { PaginatedResponse } from '../../../../../shared/models/paginated-response.model';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from "../../../../../shared/components/pagination/pagination.component";
import { RouterLink, RouterModule } from '@angular/router';
import { DeleteConfirmationComponent } from "../../../../../shared/components/delete-confirmation/delete-confirmation.component";

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, PaginationComponent, RouterLink, DeleteConfirmationComponent],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit{
  
  products: ProductAdminList[] = [];
  pagination : Omit<PaginatedResponse<ProductAdminList>, 'items'> = {
  pageNumber: 1,
  pageSize: 9,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false
};

  isDeleteModalOpen = false;
  selectedProduct: ProductAdminList | null = null;

  constructor(private productsService: ProductsService){}

  ngOnInit(): void {
    this.loadProducts();
  }

   loadProducts(): void {
  this.productsService.getProducts({
    pageNumber: this.pagination.pageNumber,
    pageSize: this.pagination.pageSize
  }).subscribe((res: PaginatedResponse<ProductAdminList>) => {
    this.products = res.items;
    this.pagination = {
      pageNumber: res.pageNumber,
      pageSize: res.pageSize,
      totalCount: res.totalCount,
      totalPages: res.totalPages,
      hasPreviousPage: res.hasPreviousPage,
      hasNextPage: res.hasNextPage
    };
  });
}

  onPageChange(page: number): void {
  this.pagination.pageNumber = page;
  this.loadProducts();
}


  openDeleteModal(product: ProductAdminList): void {
    this.selectedProduct = product;
    this.isDeleteModalOpen = true;
  }


  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.selectedProduct = null;
  }

  
  deleteProduct(): void {
    if (!this.selectedProduct) return;

    this.productsService.deleteProduct(this.selectedProduct.id).subscribe({
      next: () => {
        // Option 1: reload from server (ensures sync with pagination)
        this.loadProducts();

        // Option 2: remove locally (faster, but pagination might desync if last item deleted)
        // this.products = this.products.filter(p => p.id !== this.selectedProduct!.id);
        console.log(`Deleted: ${this.selectedProduct!.name}`);
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Delete failed', err);
        this.closeDeleteModal();
      }
    });
  }
}
