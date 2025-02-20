import { Routes } from '@angular/router';
import { CartComponent } from './Components/cart/cart.component';
import { HomeComponent } from './Components/home/home.component';
import { MenuComponent } from './Components/menu/menu.component';

export const routes: Routes = [
    {
        path:'',
        component:HomeComponent
    },
    {
        path:'home',
        component:HomeComponent
    },
    {
        path:'cart',
        component:CartComponent
    },
    {
        path:'menu',
        component:MenuComponent
    }
    

];
