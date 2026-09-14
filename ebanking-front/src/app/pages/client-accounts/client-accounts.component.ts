import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountService } from '../../core/services/account.service';
import { BankAccount } from '../../core/models/account.model';

@Component({
  selector: 'app-client-accounts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-accounts.component.html',
  styleUrl: './client-accounts.component.css'
})
export class ClientAccountsComponent implements OnInit {

  customerId!: number;

  accounts: BankAccount[] = [];

  loading = true;
  error = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {

    const id = localStorage.getItem('userId');

    if (!id) {
      this.error = 'Identifiant du client introuvable.';
      this.loading = false;
      return;
    }

    this.customerId = Number(id);

    if (isNaN(this.customerId)) {
      this.error = 'Identifiant du client invalide.';
      this.loading = false;
      return;
    }

    this.loadAccounts();
  }

  loadAccounts(): void {

    this.loading = true;
    this.error = '';

    this.accountService.getCustomerAccounts(this.customerId).subscribe({

      next: (accounts: BankAccount[]) => {

        console.log('Comptes du client :', accounts);

        this.accounts = accounts;

        this.loading = false;
      },

      error: (err) => {

        console.error('Erreur comptes client :', err);

        this.error =
          err?.error?.message ||
          'Impossible de charger les comptes.';

        this.loading = false;
      }

    });
  }

  isCurrent(account: BankAccount): boolean {
    return account.overdraft !== undefined;
  }

  openAccount(id: string): void {
    this.router.navigate(['/client-home/accounts', id]);
  }

}
