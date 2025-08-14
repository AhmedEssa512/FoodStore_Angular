import { Component } from '@angular/core';
import { SidebarComponent } from "../../features/admin/shared/sidebar/sidebar.component";
import { RouterOutlet } from "@angular/router";
import { AdminNavComponent } from "../../features/admin/shared/admin-nav/admin-nav.component";
import { AdminFooterComponent } from "../../features/admin/shared/admin-footer/admin-footer.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    RouterOutlet,
    AdminNavComponent,
    AdminFooterComponent
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
 isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    console.log(`this.isSidebarCollapsed: ${this.isSidebarCollapsed}`);
  }
}
