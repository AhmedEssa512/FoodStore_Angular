import { Component, inject, OnInit } from '@angular/core';
import { DashboardStats } from '../models/DashboardStats';
import { DashboardService } from '../services/dashboard.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-boxes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-boxes.component.html',
  styleUrl: './stats-boxes.component.css'
})
export class StatsBoxesComponent implements OnInit{

  private dashboardService = inject(DashboardService);

  stats$!: Observable<DashboardStats>;

  ngOnInit(): void {
    this.stats$ = this.dashboardService.getStats();
  }
}
