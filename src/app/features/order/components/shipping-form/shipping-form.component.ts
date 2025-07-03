import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shipping-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './shipping-form.component.html',
  styleUrl: './shipping-form.component.css'
})
export class ShippingFormComponent implements OnInit {
  customerInfo !: FormGroup;
  submitted = false;

  
  constructor(private fb: FormBuilder, private orderService:OrderService) {}

  ngOnInit(): void {
    this.customerInfo = this.fb.group({
      fullName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true; // mark that the user tried to submit

    if (this.customerInfo.valid) {
      this.orderService.createOrder(this.customerInfo.value).subscribe({
      next: (res) => {
        console.log('Order submitted successfully:', res);
        this.customerInfo.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error('Order submission failed:', err.message);
        alert(err.message); // or use a toast/snackbar
      }
    });
    }
  }

 
}
