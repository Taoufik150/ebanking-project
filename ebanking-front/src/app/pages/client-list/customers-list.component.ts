import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../core/services/customer.service';
import {UserRequest,User} from '../../core/models/user';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.css'
})
class CustomersListComponent implements OnInit {
  customers: User[] = [];
  keyword = '';
  loading = true;
  error = '';

  showForm = false;
  draft: UserRequest = {
    nom: '',
    prenom: '',
    email: '',
    username: '',
    password: '',
    phone: null,
    role: 'CUSTOMER'
  };


  saving = false;
  formError = '';

  constructor(private customerService: CustomerService, private router: Router) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading = true;
    this.error = '';
    const req$ = this.keyword.trim()
      ? this.customerService.search(this.keyword.trim())
      : this.customerService.list();

    req$.subscribe({
      next: (list) => {
        this.customers = list;
        this.loading = false;
      },
      error: () => {
        this.error = "Impossible de charger les clients. L'API est-elle démarrée sur " +
          "http://localhost:8085 ?";
        this.loading = false;
      }
    });
  }

  onSearchChange(): void {
    this.fetch();
  }


openCustomer(id?: number): void {
  if (id != null) {
    this.router.navigate(['/admin-home/customers', id]);
  }
}



  toggleForm(): void {

    this.showForm = !this.showForm;

    this.formError = '';

    this.draft = {
      nom: '',
      prenom: '',
      email: '',
      username: '',
      password: '',
      phone: null as number | null,
      role: 'CUSTOMER'
    };
  }

  submitCustomer(): void {

// Vérification
    if (
      !this.draft.nom.trim() ||
      !this.draft.prenom.trim()||
      !this.draft.password?.trim()||
      !this.draft.email.trim() ||
      !this.draft.username.trim() ||
      !this.draft.phone
    ) {

      this.formError =
        'Tous les champs sont obligatoires.';

      return;

    }

    this.saving = true;
    this.formError = '';

    this.customerService.create(this.draft).subscribe({

      next: (data) => {

        console.log(
          'Client créé avec succès :',
          data
        );

        this.saving = false;
        this.showForm = false;

        this.fetch();
      },


      error: (error) => {

        console.error(
          'Erreur création client :',
          error
        );

        this.saving = false;

        this.formError =
          error.error?.message ||
          'La création a échoué. Vérifiez les champs et réessayez.';
      }

    });
  }
}

export default CustomersListComponent
