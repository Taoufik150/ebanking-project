export type AccountStatus =
  | 'CREATED'
  | 'ACIVATED'
  | 'SUSPENDED';

export type OperationType =
  | 'DEBIT'
  | 'CREDIT';

import { User } from './user';

export interface BankAccount {
  id: string;
  balance: number;
  creationDate: Date;
  status: string;

  customerDto?: User;

  overdraft?: number;
  interestRate?: number;
}

export interface AccountOperation {
  id: number;
  operationDate: string;
  amount: number;
  type: OperationType;
  description: string;
}


export interface AccountHistory {

  id: string;

  balence: number;

  type: string;

  totalepage: number;

  cuurentpage: number;

  sizepage: number;

  accountOperationDtos: AccountOperation[];
}


export interface NewAccountRequest {

  initialBalance: number;

  rate: number;

  customerId: number;
}


export interface DebitCreditRequest {

  accountId: string;

  amount: number;

  description: string;
}


export interface TransferRequest {

  accountIdSource: string;

  accountIdDestination: string;

  amount: number;
}


export interface dashboard {

  totalCustomers: number;

  totalAccounts: number;

  totalBalance: number;

  totalOperations: number;
}

