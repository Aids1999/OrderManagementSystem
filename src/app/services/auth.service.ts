import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../api.config';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser: User | null = null;

  constructor(private http: HttpClient) {}

  async login(email: string, password: string): Promise<void> {
    this.currentUser = await firstValueFrom(
      this.http.post<User>(`${API_URL}/auth/login`, { email, password })
    );
  }

  async register(name: string, email: string, password: string): Promise<void> {
    this.currentUser = await firstValueFrom(
      this.http.post<User>(`${API_URL}/auth/register`, { name, email, password })
    );
  }

  async updateProfile(name: string, email: string): Promise<void> {
    if (!this.currentUser) {
      throw new Error('Пользователь не авторизован');
    }
    this.currentUser = await firstValueFrom(
      this.http.put<User>(`${API_URL}/profile`, {
        userId: this.currentUser.id,
        name,
        email
      })
    );
  }

  logout(): void {
    this.currentUser = null;
  }
}
