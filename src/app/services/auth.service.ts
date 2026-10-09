import { Injectable } from '@angular/core';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Пока сервера нет, пользователи хранятся в обычном массиве.
  private users: User[] = [
    { id: 1, name: 'Анна Заказчик', email: 'customer@mail.ru', password: '123456', role: 'customer' },
    { id: 2, name: 'Иван Исполнитель', email: 'executor@mail.ru', password: '123456', role: 'executor' }
  ];

  currentUser: User | null = null;

  login(email: string, password: string): boolean {
    this.currentUser = this.users.find(user =>
      user.email === email && user.password === password
    ) ?? null;
    return this.currentUser !== null;
  }

  register(name: string, email: string, password: string): boolean {
    if (this.users.some(user => user.email === email)) {
      return false;
    }

    this.currentUser = {
      id: this.users.length + 1,
      name,
      email,
      password,
      role: 'customer'
    };
    this.users.push(this.currentUser);
    return true;
  }

  updateProfile(name: string, email: string): boolean {
    if (!this.currentUser || this.users.some(user =>
      user.email === email && user.id !== this.currentUser?.id
    )) {
      return false;
    }

    this.currentUser.name = name;
    this.currentUser.email = email;
    return true;
  }

  logout(): void {
    this.currentUser = null;
  }
}
