import { Component } from '@angular/core';
import { ReportsService } from './services/reports.service';
import { SalesByCategoryReport } from './models/SalesByCategoryReport';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
sales: SalesByCategoryReport[] = [];

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.reportsService.getSalesByCategory().subscribe({
      next: (res) => (this.sales = res),
      error: () => console.log("Fetshing reposts data error")
    });
  }

  downloadExcel() {
    this.reportsService.exportSalesByCategoryExcel().subscribe(blob => {
      this.downloadFile(blob, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'sales-by-category.xlsx');
    });
  }

  downloadPdf() {
    this.reportsService.exportSalesByCategoryPdf().subscribe(blob => {
      this.downloadFile(blob, 'application/pdf', 'sales-by-category.pdf');
    });
  }

  private downloadFile(blob: Blob, type: string, fileName: string) {
    const url = window.URL.createObjectURL(new Blob([blob], { type }));
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }

}
