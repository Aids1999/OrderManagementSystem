import { email, password, requiredString } from '../../domain/guard.js';
import { User } from '../../domain/user.js';
import { LoginInput, RegisterInput, UserDto } from '../dto.js';
import { ConflictError, UnauthorizedError } from '../errors.js';
import { toUserDto } from '../mappers.js';
import { UserRepository } from '../repositories/user.repository.js';

export class AuthService {
  constructor(private readonly users: UserRepository) {}

  async login(input: LoginInput): Promise<UserDto> {
    const userEmail = email(input?.email);
    const userPassword = password(input?.password);
    const user = await this.users.findByEmail(userEmail);
    if (!user || user.password !== userPassword) {
      throw new UnauthorizedError('Неверный email или пароль');
    }
    return toUserDto(user);
  }

  async register(input: RegisterInput): Promise<UserDto> {
    const name = requiredString(input?.name, 'Имя', 100);
    const userEmail = email(input?.email);
    const userPassword = password(input?.password);
    if (await this.users.findByEmail(userEmail)) {
      throw new ConflictError('Пользователь с таким email уже существует');
    }

    const user = new User(await this.users.nextId(), name, userEmail, userPassword, 'customer');
    await this.users.add(user);
    return toUserDto(user);
  }
}
