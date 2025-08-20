import { Component } from '@angular/core';
import { ProductsListComponent } from "./products-list/products-list.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductsListComponent, RouterModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

}
