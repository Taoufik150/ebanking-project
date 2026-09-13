import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {DashboardService} from '../../core/services/dashboard.service';
import {OnInit} from '@angular/core';
import {User} from '../../core/models/user';


@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent implements OnInit{

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
          console.log('Profil admin modifié :', data);
          this.user = data;
        },
        error: (err) => {
          console.error('Erreur modification profil :', err);
        }
      });
  }

}
