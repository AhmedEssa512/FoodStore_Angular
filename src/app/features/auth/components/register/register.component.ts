import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { passwordMatchValidator } from '../../../../shared/validators/password-match.validator';
import { RegisterRequest } from '../../models/RegisterRequest';
import { CartService } from '../../../cart/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{

  registerForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cartService: CartService,
    private router : Router,
  ){}


  ngOnInit(): void {
    this.registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: passwordMatchValidator
  });  
 }

 onRegister(){
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const registerData: RegisterRequest = {
      email: this.registerForm.value.email,
      username: this.registerForm.value.username,
      password: this.registerForm.value.password
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        this.cartService.mergeGuestCartToBackend();
        this.router.navigate(['/']); // or a success page
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
 }


 
}
