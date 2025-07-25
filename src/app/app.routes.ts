import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './features/home/components/home/home.component';
import { MenuComponent } from './features/home/components/menu/menu.component';
import { CartComponent } from './features/cart/components/cart/cart.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { ShippingFormComponent } from './features/order/components/shipping-form/shipping-form.component';
import { authGuard } from './core/guards/auth.guard';
import { OrderHistoryComponent } from './features/order/components/order-history/order-history.component';
import { OrderDetailsComponent } from './features/order/components/order-details/order-details.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { ProfileComponent } from './features/profile/components/profile/profile.component';
import { ForgotPasswordComponent } from './features/auth/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/components/reset-password/reset-password.component';


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
          { path: 'orders', component: OrderHistoryComponent, canActivate: [authGuard] },
          { path: 'orders/:id', component: OrderDetailsComponent, canActivate: [authGuard]},
          { path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
        ],
      },

      {
        path: '',
        component: AuthLayoutComponent,
        children: [
          { path: 'login', loadComponent: () => import('./features/auth/components/login/login.component').then(m => m.LoginComponent)},
          { path: 'register', component: RegisterComponent },
          { path: 'forgot-password', component: ForgotPasswordComponent },
          { path: 'reset-password', component: ResetPasswordComponent },
        ],
      },
    

];
