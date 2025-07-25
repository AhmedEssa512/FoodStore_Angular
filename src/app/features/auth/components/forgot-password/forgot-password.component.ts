import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm !: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
  ){}

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

   onSubmit() {
    if (this.forgotPasswordForm.invalid) return;

    const email = this.forgotPasswordForm.value.email;

    this.authService.forgotPassword(email).subscribe({
    next: () => {
      this.successMessage = 'If the email exists, a reset link has been sent.';
      this.errorMessage = '';
      this.forgotPasswordForm.reset();
    },
    error: () => {
      // You can optionally handle errors here if needed
      this.successMessage = '';
      this.errorMessage = 'Something went wrong. Please try again.';
    }
  });


   }
}
