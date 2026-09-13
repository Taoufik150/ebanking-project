import { Component } from '@angular/core';
import {NavbarComponent} from '../navbar/navbar.component';
import {AdminDashboardComponent} from '../admin-dashboard/admin-dashboard.component';
import {AdminProfileComponent} from '../admin-profile/admin-profile.component';
import {AccountsListComponent} from '../accounts-list/accounts-list.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [NavbarComponent,AccountsListComponent,AdminProfileComponent,AdminDashboardComponent,RouterOutlet  ],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {

}
