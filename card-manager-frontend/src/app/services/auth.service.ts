import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { JwtResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { jwtDecode } from "jwt-decode"; // Instalar: npm install jwt-decode

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'access_token';
  private currentUserSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { 
    this.loadUserFromToken();
  }

  login(credentials: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${environment.authApiUrl}/login`, credentials)
      .pipe(tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        this.loadUserFromToken();
      }));
  }

  register(data: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${environment.authApiUrl}/register`, data);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    window.location.reload();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserId(): number | null {
    const user = this.currentUserSubject.value as Record<string, unknown> | null;
    // IMPORTANTE: O token precisa ter o ID do usuário (claim 'id' ou 'userId').
    // Se não tiver, o backend precisa ser ajustado ou buscar o perfil pelo email.
    const rawId = user?.['userId'] ?? user?.['id'] ?? user?.['sub'];
    const parsedId = typeof rawId === 'number' ? rawId : typeof rawId === 'string' ? Number(rawId) : NaN;
    return Number.isFinite(parsedId) ? parsedId : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private loadUserFromToken() {
    const token = this.getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        this.currentUserSubject.next(decoded);
      } catch (e) {
        console.error('Erro ao decodificar token', e);
        this.logout();
      }
    }
  }
}
