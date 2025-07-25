import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../../../shared/validators/password-match.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ResetPasswordRequest } from '../../models/ResetPasswordRequest';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm !:FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  email: string = '';
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService

  ){}

  ngOnInit(): void {
    // Get token and email from query string
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.token = params['token'];
    });

    
    this.resetPasswordForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
    confirmPassword: ['', Validators.required]
    }, { 
      validators: passwordMatchValidator 
    });

  }


  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
    this.resetPasswordForm.markAllAsTouched();
    return;
  }

    const newPassword = this.resetPasswordForm.value.password;


    if (!this.email || !this.token) {
    this.errorMessage = 'Invalid or missing reset token.';
    return;
  }
  const encodedToken = encodeURIComponent(this.token);

    const resetData: ResetPasswordRequest = {
    email: this.email,
    token: encodedToken,
    newPassword : newPassword
  };

  console.log('Reset Data:', resetData);


  this.authService.resetPassword(resetData).subscribe({
    next: (result) => {
      if (result.success) {
        this.successMessage = 'Password has been reset successfully.';
        this.errorMessage = '';
        this.resetPasswordForm.reset();
      } else {
        this.successMessage = '';
        this.errorMessage = result.errors?.[0] ?? 'Reset failed.';
      }
    },
    error: () => {
      this.successMessage = '';
      this.errorMessage = 'Something went wrong. Please try again.';
      // console.log(result.);
    }
  });

  }


}
