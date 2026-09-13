import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { User, UserRequest } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private base = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) {}

  // =========================
  // LISTE DES CLIENTS
  // =========================

  list(): Observable<User[]> {
    return this.http.get<User[]>(this.base);
  }

  // =========================
  // RECHERCHE
  // =========================

  search(keyword: string): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.base}/search`,
      {
        params: { keyword }
      }
    );
  }

  // =========================
  // CLIENT PAR ID
  // =========================

  get(id: number): Observable<User> {
    return this.http.get<User>(
      `${this.base}/${id}`
    );
  }

  // =========================
  // CRÉER UN CLIENT
  // =========================

  create(customer: UserRequest): Observable<User> {
    return this.http.post<User>(
      this.base,
      customer
    );
  }

  // =========================
  // MODIFIER UN CLIENT
  // =========================

  update(
    id: number,
    customer: UserRequest
  ): Observable<User> {

    return this.http.put<User>(
      `${this.base}/${id}`,
      customer
    );
  }

  // =========================
  // SUPPRIMER UN CLIENT
  // =========================

  delete(id: number): Observable<void> {

    return this.http.delete<void>(
      `${this.base}/${id}`
    );
  }
}
