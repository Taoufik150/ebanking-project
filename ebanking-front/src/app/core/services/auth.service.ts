import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginRequest,LoginResponse} from '../models/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private baseUrl='http://localhost:8085/auth';
  constructor(private http:HttpClient) { }
  login(Request:LoginRequest): Observable<LoginResponse>{

     return this.http.post<LoginResponse>(`${this.baseUrl}/login`,Request);
}
}
