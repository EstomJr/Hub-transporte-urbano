import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { Card } from '../models/card.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private cardsSubject = new BehaviorSubject<Card[]>([]);
  cards$ = this.cardsSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  private resolveUserId(): number | null {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('User ID inválido ou ausente. Verifique o token JWT e o login.');
      return null;
    }
    return userId;
  }

  listarCartoes(): void {
    const userId = this.resolveUserId();
    if (userId === null) return;

    this.http.get<Card[]>(`${environment.userApiUrl}/${userId}/cards`)
      .subscribe({
        next: (cards) => this.cardsSubject.next(cards),
        error: (err) => console.error('Erro ao buscar cartões', err)
      });
  }

  adicionarCartao(card: Card): Observable<Card> {
    const userId = this.resolveUserId();
    if (userId === null) {
      return throwError(() => new Error('User ID inválido ou ausente.'));
    }
    return this.http.post<Card>(`${environment.userApiUrl}/${userId}/cards`, card);
  }

  removerCartao(cardId: number): Observable<void> {
    const userId = this.resolveUserId();
    if (userId === null) {
      return throwError(() => new Error('User ID inválido ou ausente.'));
    }
    return this.http.delete<void>(`${environment.userApiUrl}/${userId}/cards/${cardId}`);
  }

  atualizarStatus(cardId: number, novoStatus: boolean): Observable<Card> {
    const userId = this.resolveUserId();
    if (userId === null) {
      return throwError(() => new Error('User ID inválido ou ausente.'));
    }
    return this.http.patch<Card>(
      `${environment.userApiUrl}/${userId}/cards/${cardId}/status?status=${novoStatus}`, 
      {}
    );
  }
}
