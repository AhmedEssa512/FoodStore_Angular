import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';
import { CartService } from './features/cart/services/cart.service';
import { filter, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    NgxSpinnerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'FoodStore';

  constructor(private authService: AuthService, private cartService: CartService) {}

  ngOnInit() {
  this.authService.isLoggedIn$
    .pipe(
      filter((v): v is boolean => v !== null), // wait until initialized
      take(1),
      switchMap(() => this.cartService.loadInitialCart())
    )
    .subscribe({
      next: () => console.log('Cart loaded successfully'),
      error: err => console.error('Cart load error break during checkauth', err),
    });
}


}
