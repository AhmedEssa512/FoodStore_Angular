import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-nav.component.html',
  styleUrl: './admin-nav.component.css'
})
export class AdminNavComponent {

@Output() sidebarToggle = new EventEmitter<void>();

  isMessagesOpen = false;
  isNotificationsOpen = false;
  isNavOpen = false;


   onToggleClick() {
    this.sidebarToggle.emit();
  }

  toggleMessages(event: Event) {
    event.preventDefault();
    this.isMessagesOpen = !this.isMessagesOpen;
    this.isNotificationsOpen = false;
  }

  toggleNotifications(event: Event) {
    event.preventDefault();
    this.isNotificationsOpen = !this.isNotificationsOpen;
    this.isMessagesOpen = false;
  }


}
