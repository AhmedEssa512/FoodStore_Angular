import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { filter, map, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../features/cart/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  inHomePage: boolean = false; 
  searchQuery = '';
  cartItemCount$: Observable<number | 0>;
  isMenuOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private cartService: CartService
  ){
    this.router.events
      this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        const currentUrl = event.urlAfterRedirects;
        this.inHomePage = currentUrl === '/' || currentUrl === '/home';
      });

      this.cartItemCount$ = this.cartService.cartItemCount$;
      console.log("cartItemCount: "+ this.cartItemCount$);
  }


  onSearch() {
  if (this.searchQuery.trim()) {
    this.router.navigate(['/menu'], { queryParams: { search: this.searchQuery } });
    this.searchQuery = '';
  }
 }

logout(){
  this.authService.logout().subscribe();
}

closeMenu() {
    this.isMenuOpen = false;
  }

}
