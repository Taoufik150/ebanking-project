import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountOperation } from '../../core/models/account.model';
import { AccountService } from '../../core/services/account.service';

@Component({
  selector: 'app-client-virements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-virements.component.html',
  styleUrl: './client-virements.component.css'
})
export class ClientVirementsComponent implements OnInit {

  operations: AccountOperation[] = [];
  totalOperation = 0;

  loading = true;
  error = '';

  constructor(private service: AccountService) {}

  ngOnInit(): void {

    const userId = localStorage.getItem('userId');

    if (!userId) {
      this.error = 'Utilisateur non identifié.';
      this.loading = false;
      return;
    }

    const customerId = Number(userId);

    if (isNaN(customerId)) {
      this.error = 'Identifiant utilisateur invalide.';
      this.loading = false;
      return;
    }

    this.service.getOperationCustomer(customerId).subscribe({
      next: (data) => {
        console.log('Les opérations :', data);

        this.operations = data;
        this.totalOperation = data.length;

        this.loading = false;
      },

      error: (error) => {
        console.error('Pas d’opération :', error);

        this.error = 'Impossible de charger les opérations.';
        this.loading = false;
      }
    });
  }
}
