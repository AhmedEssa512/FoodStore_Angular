import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StatsBoxesComponent } from "./stats-boxes/stats-boxes.component";
import { SalesChartComponent } from "./sales-chart/sales-chart.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatsBoxesComponent, SalesChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
test()
{
  console.log("Test in dashboard");
}
}
