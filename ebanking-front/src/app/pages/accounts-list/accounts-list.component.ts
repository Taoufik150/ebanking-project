import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { BankAccount } from '../../core/models/account.model';
import { AccountService } from '../../core/services/account.service';

@Component({
  selector: 'app-accounts-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accounts-list.component.html',
  styleUrl: './accounts-list.component.css'
})
export class AccountsListComponent implements OnInit {

  accounts: BankAccount[] = [];
  loading = true;
  error = '';

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.accountService.list().subscribe({
      next: (list) => {
        this.accounts = list;
        this.loading = false;
      },

      error: (err) => {
        console.error(err);

        this.error =
          "Impossible de charger les comptes. L'API est-elle démarrée sur http://localhost:8085 ?";

        this.loading = false;
      }
    });
  }

  isCurrent(account: BankAccount): boolean {
    return account.overdraft !== undefined;
  }

  open(id: string): void {
    this.router.navigate(['/admin-home/accounts', id]);
  }
}
