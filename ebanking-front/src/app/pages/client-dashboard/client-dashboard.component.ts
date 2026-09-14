import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../core/services/account.service';
import { BankAccount } from '../../core/models/account.model';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.css'
})
export class ClientDashboardComponent implements OnInit {

  accounts: BankAccount[] = [];

  totalAccounts = 0;
  totalBalance = 0;

  isLoading = true;
  hasError = false;

  // Pour le moment, on utilise le client Hassan
  customerId!:number;

  constructor(private accountService: AccountService,private router:Router) {}

  ngOnInit(): void {
   const id=localStorage.getItem('userId');
   if(!id){
     console.error('Id utilisateur introuvable');
     this.hasError=true;
     this.isLoading=false;
     return
   }
   this.customerId=Number(id);
   if(isNaN(this.customerId)){
     console.error('Id invalide');
     this.isLoading=false;
     this.hasError=true;
     return;
   }
   this.loadAccounts()
     }

  loadAccounts(): void {
    this.isLoading = true;
    this.hasError = false;

    this.accountService
      .getCustomerAccounts(this.customerId)
      .subscribe({
        next: (data) => {
          this.accounts = data;
          this.totalAccounts = data.length;
          this.totalBalance = data.reduce(
            (total, account) => total + account.balance,
            0
          );
          this.isLoading = false;
        },

        error: (err) => {
          console.error(
            'Erreur lors de la récupération des comptes :',
            err
          );
          this.hasError = true;
          this.isLoading = false;
        }
      });
  }

  isSavingsAccount(account: BankAccount): boolean {
    return (account as any).intersetRate !== undefined;
  }

  openAccount(id: string): void {

    this.router.navigate(['/client-home/accounts', id]);
  }
}

