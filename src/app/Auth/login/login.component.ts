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

  constructor(private fb: FormBuilder, private _authService:AuthService,private router: Router) {}

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {

      const loginData:ILoginRequest = this.loginForm.value;
  
      this._authService.login(loginData).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
  
          this.router.navigate(['/home']); // or any route
        },
        error: (error) => {
          console.error('Login failed:', error);
          // Show an error message to the user (optional)
        }
      });
    } else {
      console.log('Form is invalid');
      this.loginForm.markAllAsTouched(); // highlight all invalid fields
    }
  }
  

}
