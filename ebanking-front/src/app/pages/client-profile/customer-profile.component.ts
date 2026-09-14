import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {User} from '../../core/models/user';
import {DashboardService} from '../../core/services/dashboard.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule],
  templateUrl: './customer-profile.component.html',
  styleUrl: './customer-profile.component.css'
})
export class CustomerProfileComponent implements OnInit{
  user?:User;


  password = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  constructor(private service:DashboardService) {
  }

  ngOnInit(): void {

    const id = Number(localStorage.getItem('userId'));

    console.log('1 - Appel API avec ID :', id);

    this.service.getAdminProfile(id).subscribe({
      next: (data) => {
        console.log('2 - DONNÉE REÇUE :', data);
        this.user = data;
        console.log('3 - USER :', this.user);
      },

      error: (err) => {
        console.error('4 - ERREUR API :', err);
      }
    });

  }
  saveProfile(): void {

    if (!this.user) {
      return;
    }

    this.service.upDateProfile(this.user.id, this.user)
      .subscribe({
        next: (data) => {
          console.log('Profil client modifié :', data);
          this.user = data;
        },
        error: (err) => {
          console.error('Erreur modification profil :', err);
        }
      });
  }
}
