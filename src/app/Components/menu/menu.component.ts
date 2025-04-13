import { Component, OnInit } from '@angular/core';
import { IFood } from '../../Models/IFood';
import { FoodComponent } from "../food/food.component";
import { CommonModule } from '@angular/common';
import { FoodService } from '../../Services/food.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [FoodComponent, CommonModule,HttpClientModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {


    foodList:any[] = [];

    constructor(private _service:FoodService) {}

    // ngOnInit(): void {
    //   this._service.getFoods().subscribe((data)=>{
    //     this.foodList = data;
    //     console.log(data);
    //   });
    // }

    ngOnInit(): void {
      this._service.getFoods().subscribe(
        (data) => {
          this.foodList = data;
          console.log('Data received:', data);
        },
        (error) => {
          console.error('Failed to fetch data:', error);
        }
      );
    }
}

    // foodList:IFood[] = [
    //   {
    //     id: '1',
    //     name: 'Pizza',
    //     photo: 'assets/images/f1.png', 
    //     description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil.',
    //     price: 20
    //   },
    //   {
    //     id: '2',
    //     name: 'burger',
    //     photo: 'assets/images/f2.png', 
    //     description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil.',
    //     price: 30
    //   },
    //   {
    //     id: '3',
    //     name: 'pasta',
    //     photo: 'assets/images/f3.png', 
    //     description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil.',
    //     price: 22
    //   },
    //   {
    //     id: '4',
    //     name: 'fries',
    //     photo: 'assets/images/f4.png', 
    //     description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil.',
    //     price: 25
    //   },
    //   {
    //     id: '5',
    //     name: 'Margherita Pizza',
    //     photo: 'assets/images/f5.png', 
    //     description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil.',
    //     price: 36
    //   },
    //   {
    //     id: '6',
    //     name: 'Margherita Pizza',
    //     photo: 'assets/images/f6.png', 
    //     description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil.',
    //     price: 40
    //   },
    //   {
    //     id: '7',
    //     name: 'Margherita Pizza',
    //     photo: 'assets/images/f7.png', 
    //     description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil.',
    //     price: 50
    //   },
    //   {
    //     id: '8',
    //     name: 'Margherita Pizza',
    //     photo: 'assets/images/f8.png', 
    //     description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil.',
    //     price: 35
    //   },
    //   {
    //     id: '9',
    //     name: 'Margherita Pizza',
    //     photo: 'assets/images/f9.png', 
    //     description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil.',
    //     price: 25
    //   }
    // ];

