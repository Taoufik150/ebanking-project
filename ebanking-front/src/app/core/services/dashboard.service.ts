import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { dashboard } from '../models/account.model';
import {User} from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl='http://localhost:8085/admin';
  constructor(private http: HttpClient) {}

  getDashboard(): Observable<dashboard> {
    return this.http.get<dashboard>(
      `${this.baseUrl}/dashboard`);
  }
  getAdminProfile(id: number): Observable<User> {
    return this.http.get<User>(
      `${this.baseUrl}/profile/${id}`
    );
  }
  upDateProfile(id:number,admin:User):Observable<User>{
       return this.http.put<User>(`${this.baseUrl}/admin/${id}`,admin);
  }
}
