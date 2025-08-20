import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../../../../shared/models/Category';
import { CategoryService } from '../../../../home/services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodFormData } from '../models/FoodFormData';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit{
  isEdit = false;
  productId!: number;

  form!: FormGroup;
  file!: File | null;
  categories: Category[] = [];
  loading = false;
  errorMessage = '';
  fileError = '';
  previewUrl: string | ArrayBuffer | null = null;
  formErrors: { [key: string]: string[] } = {};


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private categoryService: CategoryService,
    private router: Router
  )
  {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      price: ['', [Validators.required]],
      categoryId: ['', [Validators.required]]
    });

    this.loadCategories();

    // check if we are editing
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    if (this.productId) {
      this.isEdit = true;
      this.loadProduct(this.productId);
    }
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => (this.categories = res),
      error: () => (this.errorMessage = 'Failed to load categories.')
    });
  }

  loadProduct(id: number) {
    this.productsService.getProductById(id).subscribe({
      next: (product) => {
        this.form.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          categoryId: product.categoryId
        });
        this.previewUrl = product.imageUrl; // show existing image
      },
      error: () => {
        this.errorMessage = 'Failed to load product details.';
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.fileError = '';

      // preview
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(this.file);
    }
  }

  

  onSubmit() {
    if (this.form.invalid) return;

    const food: FoodFormData = {
      ...this.form.value,
      ...(this.file ? { file: this.file } : {}) // only send file if selected
    };

    this.loading = true;

    const request$ = this.isEdit
      ? this.productsService.updateProduct(this.productId, food)
      : this.productsService.createProduct(food);

    request$.pipe(finalize(() => (this.loading = false))).subscribe({
      next: () => this.router.navigate(['/admin/products']),
      error: (err) => {
        if (err.validationErrors) {
          this.formErrors = err.validationErrors;
        } else {
          this.errorMessage = err.message ?? 'Something went wrong.';
        }
      }
    });
  }

}
