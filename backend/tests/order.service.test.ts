import assert from 'node:assert/strict';
import test from 'node:test';
import { OrderService } from '../src/application/services/order.service.js';
import { InMemoryOrderRepository } from '../src/infrastructure/in-memory-order.repository.js';
import { InMemoryUserRepository } from '../src/infrastructure/in-memory-user.repository.js';

function createService() {
  return new OrderService(new InMemoryOrderRepository(), new InMemoryUserRepository());
}

const form = {
  title: 'Новый заказ',
  description: 'Описание заказа',
  deadline: '2026-11-01',
  price: 1500
};

test('заказы возвращаются постранично', async () => {
  const service = createService();
  await service.create(1, form);
  const result = await service.getPage(1, 'all', 1, 1);
  assert.equal(result.items.length, 1);
  assert.equal(result.total, 2);
  assert.equal(result.totalPages, 2);
});

test('заказ можно создать и изменить', async () => {
  const service = createService();
  const created = await service.create(1, form);
  await service.update(created.id, 1, { ...form, title: 'Изменённый заказ' });
  assert.equal((await service.getById(created.id, 1)).title, 'Изменённый заказ');
});

test('заказ можно удалить', async () => {
  const service = createService();
  const created = await service.create(1, form);
  await service.delete(created.id, 1);
  await assert.rejects(() => service.getById(created.id, 1));
});

test('исполнитель принимает и завершает заказ', async () => {
  const service = createService();
  await service.accept(1, 2);
  assert.equal((await service.getById(1, 2)).status, 'in_progress');
  await service.setStatus(1, 2, 'completed');
  assert.equal((await service.getById(1, 2)).status, 'completed');
});

test('неверные данные заказа отклоняются', async () => {
  const service = createService();
  await assert.rejects(() => service.create(1, { ...form, price: -1 }));
  await assert.rejects(() => service.getPage(1, 'all', 1, 101));
});
