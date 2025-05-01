import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router , ActivatedRoute } from '@angular/router';
import { ILoginRequest } from '../../Models/ILoginRequest';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!: FormGroup;
  errorMessage = '';
  returnUrl: string = '/'; // default to home

  constructor(private fb: FormBuilder, private _authService:AuthService,private _cartService:CartService,private router: Router, private route:ActivatedRoute) {}

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email , Validators.pattern(/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com)$/)]],
      password: ['', [Validators.required , Validators.minLength(5), Validators.maxLength(20)]]
    });

    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
  }


  onSubmit() {
    if (this.loginForm.valid) {
      const loginData: ILoginRequest = this.loginForm.value;
  
      this._authService.login(loginData).subscribe({
        next: (response) => {
          
          this.errorMessage = '';
          this._cartService.mergeGuestCartToBackend();
          if (this.returnUrl?.startsWith('/')) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigate(['/']);
          }

        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'An unexpected error occurred.';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();  // Highlight invalid fields
    }
  }


  logOut()
  {
    this._authService.logout();
  }
  

}
