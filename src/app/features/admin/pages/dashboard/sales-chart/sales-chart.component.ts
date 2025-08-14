import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-sales-chart',
  standalone: true,
  imports: [],
  templateUrl: './sales-chart.component.html',
  styleUrl: './sales-chart.component.css'
})
export class SalesChartComponent implements AfterViewInit{
@ViewChild('salesCanvas') salesCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;


  ngAfterViewInit(): void {
    const ctx = this.salesCanvas.nativeElement.getContext('2d');

    if (ctx) {
      const config: ChartConfiguration = {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Monthly Sales',
              data: [120, 150, 180, 90, 200, 170],
              backgroundColor: '#4e73df'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true },
            title: { display: true, text: 'Sales Overview' }
          }
        }
      };

      this.chart = new Chart(ctx, config);
    }
  }
}
