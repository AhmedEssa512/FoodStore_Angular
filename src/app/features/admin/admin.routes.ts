import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';
import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout.component';


export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/products/products.component').then(
            m => m.ProductsComponent
          )
      },
       {
        path: 'orders',
        loadComponent: () =>
          import('./pages/orders/orders.component').then(
            m => m.OrdersComponent
          )
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./pages/orders/admin-order-details/admin-order-details.component').then(
            m => m.AdminOrderDetailsComponent
          )
      },
      {
        path: 'products/create',
        loadComponent: () =>
          import('./pages/products/product-form/product-form.component').then(
            m => m.ProductFormComponent
          )
      },
      {
        path: 'products/:id/edit',
        loadComponent: () =>
          import('./pages/products/product-form/product-form.component').then(
            m => m.ProductFormComponent
          )
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./pages/customers/customers.component').then(
            m => m.CustomersComponent
          )
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports/reports.component').then(
            m => m.ReportsComponent
          )
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];