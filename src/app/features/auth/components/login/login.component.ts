import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router , ActivatedRoute, RouterModule } from '@angular/router';
import { LoginRequest } from '../../models/LoginRequest';
import { AuthService } from '../../../../core/services/auth.service';
import { map, switchMap } from 'rxjs';
import { CartService } from '../../../cart/services/cart.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule ,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage = '';
  returnUrl: string = '/'; // default to home

  constructor(
     private fb: FormBuilder,
     private _authService:AuthService,
     private router: Router,
     private route:ActivatedRoute,
     private cartService: CartService,

    ) {}

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email , Validators.pattern(/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com)$/)]],
      password: ['', [Validators.required , Validators.minLength(5), Validators.maxLength(20)]]
    });

    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
  }


  onSubmit() {
    if (this.loginForm.valid) {
      const loginData: LoginRequest = this.loginForm.value;
  
      this._authService.login(loginData).pipe(
        switchMap(user =>
        this.cartService.mergeGuestCartToBackend().pipe(map(() => user))
      )
      ).subscribe({
        next: (response) => {
          this.errorMessage = '';
          if (this.returnUrl?.startsWith('/')) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigate(['/']);
          }

        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();  // Highlight invalid fields
    }
  }

  

}
