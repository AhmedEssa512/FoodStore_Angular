import { Component, OnInit } from '@angular/core';
import { FoodComponent } from "../food/food.component";
import { CommonModule } from '@angular/common';
import { FoodService } from '../../services/food.service';
import { HttpClientModule } from '@angular/common/http';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/Category';
import { Food } from '../../models/Food';
import { PaginatedResponse } from '../../../../shared/models/paginated-response.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [FoodComponent, CommonModule,HttpClientModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {


    foodList: Food[] = [];
    pagination!: Omit<PaginatedResponse<Food>, 'items'>;
    categories: Category[] = [];
    errorMessage = '';
    selectedCategoryId: number | null = null;
    currentPage: number = 1;
    pageSize: number = 10;
    searchQuery: string | null = null;

    constructor(private _foodService :FoodService, private _categoryService :CategoryService, private route: ActivatedRoute ) {}

    ngOnInit(): void {

      this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || null;
      this.selectedCategoryId = null; // Clear category if search is active
      this.currentPage = 1; // Reset page number
      this.loadFoods();
    });

    this.loadCategories();

      // this.loadFoods();
      // this.loadCategories();
    }
  
    // private loadFoods(): void {
    //   this._foodService.getFoods({
    //     categoryId: this.selectedCategoryId ?? undefined,
    //     pageNumber: this.currentPage,
    //     pageSize: this.pageSize
    //   }).subscribe({
    //     next: (data: PaginatedResponse<Food>) => {
    //       this.foodList = data.items;
    //       this.pagination = {
    //     pageNumber: data.pageNumber,
    //     pageSize: data.pageSize,
    //     totalCount: data.totalCount,
    //     totalPages: data.totalPages,
    //     hasPreviousPage: data.hasPreviousPage,
    //     hasNextPage: data.hasNextPage
    //   };
    //       console.log('Foods:', data);
    //     },
    //     error: (err) => {
    //       this.errorMessage = 'Failed to load foods';
    //       console.error(err);
    //     }
    //   });
    // }

  loadFoods(): void {
  const foods$ = this.searchQuery
    ? this._foodService.searchFoods(this.searchQuery, this.currentPage, this.pageSize)
    : this._foodService.getFoods({
        categoryId: this.selectedCategoryId ?? undefined,
        pageNumber: this.currentPage,
        pageSize: this.pageSize
      });

  foods$.subscribe({
    next: (data) => this.handleFoodResponse(data),
    error: (err) => console.log("loadfoods error , untill create interceptor for global errors")
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
      this.currentPage = 1; // Reset to first page on filter
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
  
}


