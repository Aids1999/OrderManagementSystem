import { UserRepository } from '../application/repositories/user.repository.js';
import { DomainError } from '../domain/domain-error.js';
import { email, positiveInteger } from '../domain/guard.js';
import { User } from '../domain/user.js';

export class InMemoryUserRepository implements UserRepository {
  private readonly users: User[] = [
    new User(1, 'Анна Заказчик', 'customer@mail.ru', '123456', 'customer'),
    new User(2, 'Иван Исполнитель', 'executor@mail.ru', '123456', 'executor')
  ];

  async findById(idValue: number): Promise<User | undefined> {
    const id = positiveInteger(idValue, 'Идентификатор пользователя');
    return this.users.find(user => user.id === id);
  }

  async findByEmail(userEmail: string): Promise<User | undefined> {
    const normalizedEmail = email(userEmail);
    return this.users.find(user => user.email === normalizedEmail);
  }

  async add(user: User): Promise<void> {
    if (!(user instanceof User) || this.users.some(item => item.id === user.id)) {
      throw new DomainError('Некорректный пользователь');
    }
    this.users.push(user);
  }

  async update(user: User): Promise<void> {
    if (!(user instanceof User) || !this.users.some(item => item.id === user.id)) {
      throw new DomainError('Пользователь не найден');
    }
  }

  async nextId(): Promise<number> {
    return Math.max(0, ...this.users.map(user => user.id)) + 1;
  }
}
