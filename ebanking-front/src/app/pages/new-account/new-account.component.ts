import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AccountService } from '../../core/services/account.service';
import { CustomerService } from '../../core/services/customer.service';

import { User } from '../../core/models/user';
import {
  BankAccount,
  NewAccountRequest
} from '../../core/models/account.model';

@Component({
  selector: 'app-new-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './new-account.component.html',
  styleUrl: './new-account.component.css'
})
export class NewAccountComponent implements OnInit {

  // ==============================
  // CLIENT
  // ==============================

  customerId!: number;
  customer?: User;

  // ==============================
  // TYPE DE COMPTE
  // ==============================

  accountType: 'CURRENT' | 'SAVING' = 'CURRENT';

  // ==============================
  // FORMULAIRE
  // ==============================

  initialBalance = 0;
  rate = 3;

  // ==============================
  // ÉTAT
  // ==============================

  loading = true;
  saving = false;

  error = '';
  success = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private customerService: CustomerService
  ) {}

  // ==============================
  // INITIALISATION
  // ==============================

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = 'Identifiant du client invalide.';
      this.loading = false;
      return;
    }

    this.customerId = Number(id);

    if (isNaN(this.customerId)) {
      this.error = 'Identifiant du client invalide.';
      this.loading = false;
      return;
    }

    this.loadCustomer();
  }

  // ==============================
  // CHARGER CLIENT
  // ==============================

  loadCustomer(): void {

    this.customerService.get(this.customerId).subscribe({

      next: (customer: User) => {

        console.log('Client chargé :', customer);

        this.customer = customer;
        this.loading = false;
      },

      error: (err) => {

        console.error(
          'Erreur chargement client :',
          err
        );

        this.error = 'Impossible de charger le client.';
        this.loading = false;
      }

    });
  }

  // ==============================
  // CRÉER LE COMPTE
  // ==============================

  createAccount(): void {

    this.error = '';
    this.success = '';

    // Vérification du solde
    if (this.initialBalance < 0) {

      this.error =
        'Le solde initial ne peut pas être négatif.';

      return;
    }

    // Vérification du taux
    if (
      this.accountType === 'SAVING' &&
      this.rate < 0
    ) {

      this.error =
        'Le taux d’intérêt ne peut pas être négatif.';

      return;
    }

    this.saving = true;

    const request: NewAccountRequest = {
      initialBalance: this.initialBalance,
      rate: this.rate,
      customerId: this.customerId
    };

    // ==============================
    // COMPTE COURANT
    // ==============================

    if (this.accountType === 'CURRENT') {

      this.accountService
        .newCurrentAccount(request)
        .subscribe({

          next: (account: BankAccount) => {

            console.log(
              'Compte courant créé :',
              account
            );

            this.saving = false;

            this.success =
              'Le compte courant a été créé avec succès.';

            setTimeout(() => {

              this.router.navigate([
                '/admin-home/customers',
                this.customerId
              ]);

            }, 1000);
          },

          error: (err) => {

            console.error(
              'Erreur création compte courant :',
              err
            );

            this.saving = false;

            this.error =
              err.error?.message ||
              'Impossible de créer le compte courant.';
          }

        });

    }

      // ==============================
      // COMPTE ÉPARGNE
    // ==============================

    else {

      this.accountService
        .newSavingAccount(request)
        .subscribe({

          next: (account: BankAccount) => {

            console.log(
              'Compte épargne créé :',
              account
            );

            this.saving = false;

            this.success =
              'Le compte épargne a été créé avec succès.';

            setTimeout(() => {

              this.router.navigate([
                '/admin-home/customers',
                this.customerId
              ]);

            }, 1000);
          },

          error: (err) => {

            console.error(
              'Erreur création compte épargne :',
              err
            );

            this.saving = false;

            this.error =
              err.error?.message ||
              'Impossible de créer le compte épargne.';
          }

        });
    }
  }

  // ==============================
  // ANNULER
  // ==============================

  cancel(): void {

    this.router.navigate([
      '/admin-home/customers',
      this.customerId
    ]);
  }
}
