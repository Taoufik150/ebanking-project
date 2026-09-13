import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { dashboard } from '../../core/models/account.model';
import { DashboardService } from '../../core/services/dashboard.service';
import {NavbarComponent} from '../navbar/navbar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NavbarComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  dashBoard: dashboard | null = null;
  isLoading = true;
  hasError = false;

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.hasError = false;

    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.dashBoard = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur dashboard :', error);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }
}
