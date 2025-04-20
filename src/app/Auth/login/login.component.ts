import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { ILoginRequest } from '../../Models/ILoginRequest';

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

  constructor(private fb: FormBuilder, private _authService:AuthService,private router: Router) {}

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email , Validators.pattern(/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com)$/)]],
      password: ['', [Validators.required , Validators.minLength(5), Validators.maxLength(20)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {

      const loginData:ILoginRequest = this.loginForm.value;
  
      this._authService.login(loginData).subscribe({
        next: (response) => {
          this.errorMessage = '';
        //  Get redirect URL from AuthService or fallback
        const returnUrl = this._authService.getRedirectUrl() || '/';
        this._authService.clearRedirectUrl();

        // ✅ Prevent open redirect vulnerability
        if (returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
          this.router.navigateByUrl(returnUrl);
        } else {
          this.router.navigate(['/home']); 
        } 
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'An unexpected error occurred.';
        }
      });
    } else {

      this.loginForm.markAllAsTouched(); // highlight all invalid fields
    }
  }


  logOut()
  {
    this._authService.logout();
  }
  

}
