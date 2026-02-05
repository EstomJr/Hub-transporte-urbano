import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';
import { Card } from '../models/card.model';
import { AdminDashboard } from '../models/admin-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getDashboard(): Observable<AdminDashboard> {
    return this.http.get<AdminDashboard>(`${environment.adminApiUrl}/dashboard`);
  }

  listUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.adminApiUrl}/users`);
  }

  createUser(payload: { name: string; email: string; password: string; role?: string }): Observable<User> {
    return this.http.post<User>(`${environment.adminApiUrl}/users`, payload);
  }

  updateUser(userId: number, payload: { name: string; email: string; password: string; role?: string }): Observable<User> {
    return this.http.put<User>(`${environment.adminApiUrl}/users/${userId}`, payload);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${environment.adminApiUrl}/users/${userId}`);
  }

  listCards(): Observable<Card[]> {
    return this.http.get<Card[]>(`${environment.adminApiUrl}/cards`);
  }

  addCardToUser(userId: number, payload: Card): Observable<Card> {
    return this.http.post<Card>(`${environment.adminApiUrl}/users/${userId}/cards`, payload);
  }

  removeCard(userId: number, cardId: number): Observable<void> {
    return this.http.delete<void>(`${environment.adminApiUrl}/users/${userId}/cards/${cardId}`);
  }

  updateCardStatus(userId: number, cardId: number, status: boolean): Observable<Card> {
    return this.http.patch<Card>(
      `${environment.adminApiUrl}/users/${userId}/cards/${cardId}/status?status=${status}`,
      {}
    );
  }
}
