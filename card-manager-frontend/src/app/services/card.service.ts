import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Card } from '../models/card.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private readonly baseUrl = 'http://localhost:8082/api/cards';

  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  list(): Observable<Card[]> {
    return this.http.get<Card[]>(this.baseUrl, { headers: this.getHeaders() });
  }

  create(payload: Card): Observable<Card> {
    return this.http.post<Card>(this.baseUrl, payload, { headers: this.getHeaders() });
  }

  update(id: number, payload: Card): Observable<Card> {
    return this.http.put<Card>(`${this.baseUrl}/${id}`, payload, { headers: this.getHeaders() });
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
