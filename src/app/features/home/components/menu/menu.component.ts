import { Component, OnInit } from '@angular/core';
import { FoodComponent } from "../food/food.component";
import { CommonModule } from '@angular/common';
import { FoodService } from '../../services/food.service';
import { HttpClientModule } from '@angular/common/http';
import { CategoryService } from '../../services/category.service';
import { Food } from '../../models/Food';
import { PaginatedResponse } from '../../../../shared/models/paginated-response.model';
import { ActivatedRoute } from '@angular/router';
import { PaginationComponent } from "../../../../shared/components/pagination/pagination.component";
import { Category } from '../../../../shared/models/Category';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [FoodComponent, CommonModule, HttpClientModule, PaginationComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

  foodList: Food[] = [];
  pagination : Omit<PaginatedResponse<Food>, 'items'> = {
  pageNumber: 1,
  pageSize: 9,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false
};
    categories: Category[] = [];
    errorMessage = '';
    selectedCategoryId: number | null = null;
    searchQuery: string | null = null;

    constructor(private _foodService :FoodService, private _categoryService :CategoryService, private route: ActivatedRoute ) {}

    ngOnInit(): void {

      this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || null;
      this.selectedCategoryId = null; // Clear category if search is active
      this.pagination.pageNumber = 1; // Reset page number
      this.loadFoods();
    });

    this.loadCategories();

    }
  
  loadFoods(): void {
  const foods$ = this.searchQuery
    ? this._foodService.searchFoods(this.searchQuery, this.pagination.pageNumber, this.pagination.pageSize)
    : this._foodService.getFoods({
        categoryId: this.selectedCategoryId ?? undefined,
        pageNumber: this.pagination.pageNumber,
        pageSize: this.pagination.pageSize
      });

  foods$.subscribe({
    next: (data) => this.handleFoodResponse(data),
    error: (err) => console.log(`failed to load foods , the error: ${err}`)
    
  });
}
  
    private loadCategories(): void {
      this._categoryService.getCategories().subscribe({
        next: (data) => {
          this.categories = data;
          console.log('Categories:', data);
        },
        error: (err) => {
          this.errorMessage = 'Failed to load categories';
          console.error(err);
        }
      });
    }

    filterFoodsByCategory(categoryId: number | null): void {
      this.selectedCategoryId = categoryId;
      this.searchQuery = null;
      this.pagination.pageNumber = 1; // Reset to first page on filter
      this.loadFoods();
    }

    private handleFoodResponse(data: PaginatedResponse<Food>) {
    this.foodList = data.items;
    this.pagination = {
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalCount: data.totalCount,
      totalPages: data.totalPages,
      hasPreviousPage: data.hasPreviousPage,
      hasNextPage: data.hasNextPage
    };
  }


onPageChange(page: number): void {
  if (page < 1 || page > this.pagination.totalPages) return;
  this.pagination.pageNumber = page;
  this.loadFoods();
}

  
}


