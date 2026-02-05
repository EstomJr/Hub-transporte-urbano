import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  constructor(private http: HttpClient) {}

  getProfile(userId: number): Observable<User> {
    return this.http.get<User>(`${environment.userApiUrl}/${userId}`);
  }

  updateProfile(userId: number, payload: { name: string; email: string; password: string }): Observable<User> {
    return this.http.put<User>(`${environment.userApiUrl}/${userId}`, payload);
  }
}
