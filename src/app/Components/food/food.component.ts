import { Component, Input } from '@angular/core';
import { IFood } from '../../Models/IFood';

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [],
  templateUrl: './food.component.html',
  styleUrl: './food.component.css'
})
export class FoodComponent {
  @Input() food: IFood | undefined;
}
