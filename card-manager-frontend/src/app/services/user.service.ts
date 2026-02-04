import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = 'http://localhost:8082/api/users';

  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  list(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl, { headers: this.getHeaders() });
  }

  create(payload: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, payload, { headers: this.getHeaders() });
  }

  update(id: number, payload: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, payload, { headers: this.getHeaders() });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return token ? headers.set('Authorization', `Bearer ${token}`) : headers;
  }
}
