import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import {
  AccountHistory,
  AccountOperation,
  BankAccount,
  DebitCreditRequest,
  NewAccountRequest,
  TransferRequest
} from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {

  private base = `${environment.apiUrl}/accounts`;
  private opsBase = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) {}

  list(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(this.base);
  }

  get(accountId: string): Observable<BankAccount> {
    return this.http.get<BankAccount>(
      `${this.base}/${accountId}`
    );
  }

  history(accountId: string): Observable<AccountOperation[]> {
    return this.http.get<AccountOperation[]>(
      `${this.base}/${accountId}/operations`
    );
  }

  historyPage(
    accountId: string,
    page: number,
    size: number
  ): Observable<AccountHistory> {

    return this.http.get<AccountHistory>(
      `${this.base}/${accountId}/pageoperations`,
      {
        params: { page, size }
      }
    );
  }
  newCurrentAccount(
    request: NewAccountRequest
  ): Observable<BankAccount> {

    return this.http.post<BankAccount>(
      `${this.base}/current`,
      request
    );
  }

  newSavingAccount(
    request: NewAccountRequest
  ): Observable<BankAccount> {

    return this.http.post<BankAccount>(
      `${this.base}/saving`,
      request
    );
  }

  credit(
    request: DebitCreditRequest
  ): Observable<DebitCreditRequest> {

    return this.http.post<DebitCreditRequest>(
      `${this.base}/credit`,
      request
    );
  }

  debit(
    request: DebitCreditRequest
  ): Observable<DebitCreditRequest> {

    return this.http.post<DebitCreditRequest>(
      `${this.base}/debit`,
      request
    );
  }

  transfer(
    request: TransferRequest
  ): Observable<void> {

    return this.http.post<void>(
      `${this.base}/transfer`,
      request
    );
  }

  // Comptes appartenant à un client
  getCustomerAccounts(
    id: number
  ): Observable<BankAccount[]> {

    return this.http.get<BankAccount[]>(
      `${this.opsBase}/${id}/accounts`
    );
  }
}
