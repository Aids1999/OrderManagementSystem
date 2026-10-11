import assert from 'node:assert/strict';
import test from 'node:test';
import { AuthService } from '../src/application/services/auth.service.js';
import { InMemoryUserRepository } from '../src/infrastructure/in-memory-user.repository.js';

test('вход возвращает заказчика', async () => {
  const service = new AuthService(new InMemoryUserRepository());
  const user = await service.login({ email: 'customer@mail.ru', password: '123456' });
  assert.equal(user.role, 'customer');
});

test('регистрация создаёт нового пользователя', async () => {
  const service = new AuthService(new InMemoryUserRepository());
  const user = await service.register({
    name: 'Новый пользователь',
    email: 'new@mail.ru',
    password: '123456'
  });
  assert.equal(user.id, 3);
  assert.equal((await service.login({ email: 'new@mail.ru', password: '123456' })).id, 3);
});

test('регистрация проверяет email', async () => {
  const service = new AuthService(new InMemoryUserRepository());
  await assert.rejects(() => service.register({ name: 'Имя', email: 'wrong', password: '123456' }));
});

test('повторный email запрещён', async () => {
  const service = new AuthService(new InMemoryUserRepository());
  await assert.rejects(() => service.register({
    name: 'Имя',
    email: 'customer@mail.ru',
    password: '123456'
  }));
});
