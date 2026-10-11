import { email, positiveInteger, requiredString } from '../../domain/guard.js';
import { ProfileInput, UserDto } from '../dto.js';
import { ConflictError, NotFoundError } from '../errors.js';
import { toUserDto } from '../mappers.js';
import { UserRepository } from '../repositories/user.repository.js';

export class ProfileService {
  constructor(private readonly users: UserRepository) {}

  async get(userIdValue: unknown): Promise<UserDto> {
    const user = await this.findUser(userIdValue);
    return toUserDto(user);
  }

  async update(userIdValue: unknown, input: ProfileInput): Promise<UserDto> {
    const user = await this.findUser(userIdValue);
    const name = requiredString(input?.name, 'Имя', 100);
    const userEmail = email(input?.email);
    const emailOwner = await this.users.findByEmail(userEmail);
    if (emailOwner && emailOwner.id !== user.id) {
      throw new ConflictError('Этот email уже занят');
    }
    user.updateProfile(name, userEmail);
    await this.users.update(user);
    return toUserDto(user);
  }

  private async findUser(value: unknown) {
    const id = positiveInteger(value, 'Идентификатор пользователя');
    const user = await this.users.findById(id);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return user;
  }
}
