import { Component } from '@angular/core';
import { OfferComponent } from "../offer/offer.component";
import { MenuComponent } from "../menu/menu.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [OfferComponent, MenuComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
