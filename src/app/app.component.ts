import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./Components/Header/header.component";
import { FooterComponent } from "./Components/Footer/footer.component";
import { MenuComponent } from "./Components/menu/menu.component";
import { OfferComponent } from "./Components/offer/offer.component";
import { AboutComponent } from "./Components/about/about.component";
import { FoodComponent } from "./Components/food/food.component";
import { CartComponent } from "./Components/cart/cart.component";
import { HomeComponent } from "./Components/home/home.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MenuComponent, OfferComponent, AboutComponent, FoodComponent, RouterModule, CartComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FoodStore';
}
