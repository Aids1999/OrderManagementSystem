import { User } from '../../domain/user.js';

export interface UserRepository {
  findById(id: number): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  add(user: User): Promise<void>;
  update(user: User): Promise<void>;
  nextId(): Promise<number>;
}
