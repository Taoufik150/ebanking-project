import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CustomerService } from '../../core/services/customer.service';
import { AccountService } from '../../core/services/account.service';

import { BankAccount } from '../../core/models/account.model';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.css'
})
export class CustomerDetailComponent implements OnInit {

  // =========================================================
  // CLIENT
  // =========================================================

  customerId!: number;

  customer?: User;

  accounts: BankAccount[] = [];

  // =========================================================
  // ÉTAT
  // =========================================================

  loading = true;

  error = '';

  editing = false;

  saving = false;

  saveError = '';

  // =========================================================
  // FORMULAIRE
  // =========================================================

  draft = {
    nom: '',
    prenom: '',
    email: '',
    username: '',
    password: '',
    phone: null as number | null,
    role: 'CUSTOMER'
  };

  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private accountService: AccountService
  ) {}

  // =========================================================
  // INITIALISATION
  // =========================================================

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    // Vérifier si l'id existe
    if (!id) {
      this.error = 'Identifiant du client invalide.';
      this.loading = false;
      return;
    }

    // Convertir l'id en number
    this.customerId = Number(id);

    // Vérifier si la conversion est valide
    if (isNaN(this.customerId)) {
      this.error = 'Identifiant du client invalide.';
      this.loading = false;
      return;
    }

    // Charger le client
    this.fetch();
  }

  // =========================================================
  // CHARGER LE CLIENT
  // =========================================================

  fetch(): void {

    this.loading = true;
    this.error = '';

    this.customerService.get(this.customerId).subscribe({

      next: (customer: User) => {

        console.log('Client chargé :', customer);

        // Stocker le client
        this.customer = customer;

        // Remplir le formulaire
        this.draft = {
          nom: customer.nom ?? '',
          prenom: customer.prenom ?? '',
          email: customer.email ?? '',
          username: customer.username ?? '',
          password: customer.password ?? '',
          phone: customer.phone ?? null,
          role: customer.role ?? 'CUSTOMER'
        };

        // Charger ses comptes
        this.loadAccounts();
      },

      error: (error) => {

        console.error(
          'Erreur lors du chargement du client :',
          error
        );

        this.error = 'Client introuvable.';
        this.loading = false;
      }

    });
  }

  // =========================================================
  // CHARGER LES COMPTES DU CLIENT
  // =========================================================
  loadAccounts(): void {

    this.accountService
      .getCustomerAccounts(this.customerId)
      .subscribe({


  next: (accounts: BankAccount[]) => {

    console.log(
      'Comptes du client :',
      accounts
    );

    this.accounts = accounts;

    this.loading = false;
  },

  error: (error) => {

    console.error(
      'Erreur lors du chargement des comptes :',
      error
    );

    this.error =
      error.error?.message ||
      'Impossible de charger les comptes.';

    this.loading = false;
  }

});


  }


  // =========================================================
  // TYPE DE COMPTE
  // =========================================================

  isCurrent(account: BankAccount): boolean {

    return account.overdraft !== undefined;
  }

  // =========================================================
  // COMMENCER LA MODIFICATION
  // =========================================================

  startEdit(): void {

    this.editing = true;

    this.saveError = '';

    // Recharger les valeurs actuelles
    if (this.customer) {

      this.draft = {
        nom: this.customer.nom ?? '',
        prenom: this.customer.prenom ?? '',
        email: this.customer.email ?? '',
        username: this.customer.username ?? '',
        password: this.customer.password ?? '',
        phone: this.customer.phone ?? null,
        role: this.customer.role ?? 'CUSTOMER'
      };
    }
  }

  // =========================================================
  // ANNULER LA MODIFICATION
  // =========================================================

  cancelEdit(): void {

    this.editing = false;

    this.saveError = '';

    if (this.customer) {

      this.draft = {
        nom: this.customer.nom ?? '',
        prenom: this.customer.prenom ?? '',
        email: this.customer.email ?? '',
        username: this.customer.username ?? '',
        password: this.customer.password ?? '',
        phone: this.customer.phone ?? null,
        role: this.customer.role ?? 'CUSTOMER'
      };
    }
  }

  // =========================================================
  // SAUVEGARDER LA MODIFICATION
  // =========================================================

  save(): void {

    // -----------------------------
    // Validation
    // -----------------------------

    if (
      !this.draft.nom.trim() ||
      !this.draft.prenom.trim() ||
      !this.draft.email.trim() ||
      !this.draft.username.trim() ||
      !this.draft.password.trim() ||
      this.draft.phone === null
    ) {

      this.saveError =
        'Tous les champs sont obligatoires.';

      return;
    }

    // -----------------------------
    // État sauvegarde
    // -----------------------------

    this.saving = true;

    this.saveError = '';

    // -----------------------------
    // Appel backend
    // IMPORTANT : un seul update()
    // -----------------------------

    this.customerService
      .update(this.customerId, this.draft)
      .subscribe({

        next: (updated: User) => {

          console.log(
            'Client modifié avec succès :',
            updated
          );

          // Mettre à jour le client affiché
          this.customer = updated;

          // Mettre à jour le formulaire
          this.draft = {
            nom: updated.nom ?? '',
            prenom: updated.prenom ?? '',
            email: updated.email ?? '',
            username: updated.username ?? '',
            password: updated.password ?? '',
            phone: updated.phone ?? null,
            role: updated.role ?? 'CUSTOMER'
          };

          // Réinitialiser l'état
          this.saving = false;

          this.editing = false;

          this.saveError = '';
        },

        error: (error) => {

          console.error(
            'Erreur lors de la modification :',
            error
          );

          this.saving = false;

          this.saveError =
            error.error?.message ||
            'La mise à jour a échoué.';
        }

      });
  }

  // =========================================================
  // SUPPRIMER LE CLIENT
  // =========================================================

  remove(): void {

    const confirmation = confirm(
      'Supprimer définitivement ce client ?'
    );

    // L'utilisateur a annulé
    if (!confirmation) {
      return;
    }

    // -----------------------------
    // Appel DELETE
    // -----------------------------

    this.customerService
      .delete(this.customerId)
      .subscribe({

        next: () => {

          console.log(
            'Client supprimé avec succès.'
          );

          // Retour à la liste des clients
          this.router.navigate([
            '/admin-home/customers'
          ]);
        },

        error: (error) => {

          console.error(
            'Erreur lors de la suppression :',
            error
          );

          this.error =
            error.error?.message ||
            'La suppression a échoué.';
        }

      });
  }

  // =========================================================
  // OUVRIR UN COMPTE
  // =========================================================
  openAccount(id: string): void {
    this.router.navigate([
      '/admin-home/accounts',
      id
    ]);
  }

  backToCustomers(): void {
    this.router.navigate([
      '/admin-home/customers'
    ]);
  }

}
