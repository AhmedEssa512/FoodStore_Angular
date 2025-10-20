import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './features/home/components/home/home.component';
import { MenuComponent } from './features/home/components/menu/menu.component';
import { CartComponent } from './features/cart/components/cart/cart.component';
import { ShippingFormComponent } from './features/order/components/shipping-form/shipping-form.component';
import { authGuard } from './core/guards/auth.guard';
import { OrderHistoryComponent } from './features/order/components/order-history/order-history.component';
import { ProfileComponent } from './features/profile/components/profile/profile.component';
import { OrderDetailsComponent } from './features/order/components/order-details/order-details.component';
import { AboutComponent } from './features/home/components/about/about.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { FoodDetailsComponent } from './features/home/components/food-details/food-details.component';


export const routes: Routes = [
  // Main layout
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'about', component: AboutComponent },
      { path: 'cart', component: CartComponent },
      { path: 'details', component: FoodDetailsComponent },

      // Protected routes 
      {
        path: '',
        canActivateChild: [authGuard],
        children: [
          { path: 'shipping', component: ShippingFormComponent },
          { path: 'orders', component: OrderHistoryComponent },
          { path: 'orders/:id', component: OrderDetailsComponent },
          { path: 'profile', component: ProfileComponent },
        ],
      },
    ],
  },

  // Lazy-loaded Auth layout
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  // Lazy-loaded Admin area
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },

  // Fallback
  { path: '**', component: NotFoundComponent },
];