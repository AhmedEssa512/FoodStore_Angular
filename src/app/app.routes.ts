import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './features/home/components/home/home.component';
import { MenuComponent } from './features/home/components/menu/menu.component';
import { CartComponent } from './features/cart/components/cart/cart.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { ShippingFormComponent } from './features/order/components/shipping-form/shipping-form.component';
import { authGuard } from './core/guards/auth.guard';


export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
          { path: '', component: HomeComponent },
          { path: 'home', component: HomeComponent },
          { path: 'menu', component: MenuComponent },
          { path: 'cart', component: CartComponent },
          { path: 'shipping', component: ShippingFormComponent, canActivate: [authGuard] },

        ],
      },

      {
        path: '',
        component: AuthLayoutComponent,
        children: [
          { path: 'login', component: LoginComponent },
          
        ],
      },
    

];
