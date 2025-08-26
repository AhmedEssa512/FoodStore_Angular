import { Component } from '@angular/core';
import { CustomerListComponent } from "./customer-list/customer-list.component";

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CustomerListComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {

}
