import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Observable, switchMap } from 'rxjs';
import { User } from '../../models/User';
import { Router } from '@angular/router';
import { CartService } from '../../../cart/services/cart.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

   user$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,

   ){
    this.user$ = this.authService.currentUser$;
    console.log(this.user$);
  }

  logout(): void {
   this.authService.logout().pipe(
  switchMap(() => this.cartService.getCart())
  ).subscribe(() => {
   this.router.navigate(['/home']);
  });
}

  
}
