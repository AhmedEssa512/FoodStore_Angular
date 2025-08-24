import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-range-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './date-range-filter.component.html',
  styleUrl: './date-range-filter.component.css'
})
export class DateRangeFilterComponent {
  startDate: string | null = null;
  endDate: string | null = null;

  @Output() filter = new EventEmitter<{ startDate?: string; endDate?: string }>();

  applyFilter() {
    this.filter.emit({ startDate: this.startDate || undefined, endDate: this.endDate || undefined });
  }

  resetFilter() {
    this.startDate = null;
    this.endDate = null;
    this.filter.emit({});
  }
}
