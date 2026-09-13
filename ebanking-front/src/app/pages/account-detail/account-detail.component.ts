import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountService } from '../../core/services/account.service';
import { AccountHistory, BankAccount } from '../../core/models/account.model';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './account-detail.component.html',
  styleUrl: './account-detail.component.css'
})
export class AccountDetailComponent implements OnInit {
  accountId!: string;
  account?: BankAccount;
  history?: AccountHistory;
  loading = true;
  error = '';

  page = 0;
  size = 5;

  activeForm: 'credit' | 'debit' | 'transfer' | null = null;
  amount = 100;
  description = '';
  destinationId = '';
  opBusy = false;
  opError = '';
  opSuccess = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.accountId = this.route.snapshot.paramMap.get('id')!;
    this.fetchAll();
  }

  isCurrent(): boolean {
    return this.account?.overdraft !== undefined;
  }

  fetchAll(): void {
    this.loading = true;
    this.error = '';
    this.accountService.get(this.accountId).subscribe({
      next: (acc) => {
        this.account = acc;
        this.fetchHistory();
      },
      error: () => {
        this.error = 'Compte introuvable.';
        this.loading = false;
      }
    });
  }

  fetchHistory(): void {
    console.log('Chargement historique...');
    console.log('Account ID:', this.accountId);
    console.log('Page:', this.page);
    console.log('Size:', this.size);

    this.accountService.historyPage(
      this.accountId,
      this.page,
      this.size
    ).subscribe({

      next: (h) => {
        console.log('Historique reçu:', h);

        this.history = h;
        this.loading = false;
      },

      error: (err) => {
        console.error('ERREUR HISTORIQUE:', err);
        console.error('Status:', err.status);
        console.error('URL:', err.url);
        console.error('Body:', err.error);

        this.error = "Impossible de charger l'historique.";
        this.loading = false;
      }

    });
  }
  goToPage(p: number): void {
    if (p < 0 || (this.history && p >= this.history.totalepage)) return;
    this.page = p;
    this.fetchHistory();
  }

  openForm(kind: 'credit' | 'debit' | 'transfer'): void {
    this.activeForm = this.activeForm === kind ? null : kind;
    this.opError = '';
    this.opSuccess = '';
    this.amount = 100;
    this.description = '';
    this.destinationId = '';
  }

  submitOperation(): void {
    if (!this.activeForm) return;
    this.opBusy = true;
    this.opError = '';
    this.opSuccess = '';

    if (this.activeForm === 'transfer') {
      this.accountService
        .transfer({
          accountIdSource: this.accountId,
          accountIdDestination: this.destinationId.trim(),
          amount: this.amount
        })
        .subscribe({
          next: () => this.afterOperation('Virement effectué.'),
          error: (err) => this.onOpError(err)
        });
      return;
    }

    const request = {
      accountId: this.accountId,
      amount: this.amount,
      description: this.description || (this.activeForm === 'credit' ? 'Dépôt' : 'Retrait')
    };

    const req$ =
      this.activeForm === 'credit' ? this.accountService.credit(request) : this.accountService.debit(request);

    req$.subscribe({
      next: () => this.afterOperation(this.activeForm === 'credit' ? 'Crédit enregistré.' : 'Débit enregistré.'),
      error: (err) => this.onOpError(err)
    });
  }

  private afterOperation(message: string): void {
    this.opBusy = false;
    this.opSuccess = message;
    this.activeForm = null;
    this.page = 0;
    this.fetchAll();
  }

  private onOpError(err: any): void {
    this.opBusy = false;
    this.opError = err?.error?.message || "L'opération a échoué.";
  }
}
