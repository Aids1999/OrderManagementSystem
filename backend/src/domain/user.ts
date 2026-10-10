import { email, password as validPassword, positiveInteger, requiredString } from './guard.js';
import { DomainError } from './domain-error.js';

export type Role = 'customer' | 'executor';

export class User {
  readonly id: number;
  readonly role: Role;
  readonly password: string;
  name: string;
  email: string;

  constructor(id: unknown, name: unknown, userEmail: unknown, password: unknown, role: Role) {
    this.id = positiveInteger(id, 'Идентификатор пользователя');
    this.name = requiredString(name, 'Имя', 100);
    this.email = email(userEmail);
    this.password = validPassword(password);
    if (role !== 'customer' && role !== 'executor') {
      throw new DomainError('Некорректная роль');
    }
    this.role = role;
  }

  updateProfile(name: unknown, userEmail: unknown): void {
    this.name = requiredString(name, 'Имя', 100);
    this.email = email(userEmail);
  }
}
