import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {LoginRequest} from '../../core/models/login';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginData: LoginRequest = {
    username: '',
    password: ''
  };

  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {

    this.errorMessage = '';

    if (!this.loginData.username || !this.loginData.password) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    this.loading = true;

    this.authService.login(this.loginData).subscribe({
      next: (response) => {

        console.log('Utilisateur connecté :', response);

        // Sauvegarder les informations de connexion
        localStorage.setItem('userId', response.id.toString());
        localStorage.setItem('username', response.username);
        localStorage.setItem('role', response.role);

        // Redirection selon le rôle
        if (response.role === 'ADMIN') {
          this.router.navigate(['/admin-home']);
        }
        else if (response.role === 'CUSTOMER') {
          this.router.navigate(['/client-home']);
        }
        else {
          this.errorMessage = 'Rôle utilisateur inconnu.';
        }

        this.loading = false;
      },

      error: (error) => {

        console.error('Erreur login :', error);

        this.errorMessage =
          error.error?.message || 'Username ou mot de passe incorrect.';

        this.loading = false;
      }
    });
  }
}
