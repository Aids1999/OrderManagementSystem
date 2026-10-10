import assert from 'node:assert/strict';
import { AddressInfo } from 'node:net';
import test from 'node:test';
import { createApp } from '../src/api/app.js';

test('API возвращает правильные HTTP-коды', async () => {
  const server = createApp().listen(0);
  const port = (server.address() as AddressInfo).port;
  const url = `http://127.0.0.1:${port}/api`;

  try {
    const register = await fetch(`${url}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Тест', email: 'test@mail.ru', password: '123456' })
    });
    assert.equal(register.status, 201);

    const page = await fetch(`${url}/orders?userId=1&status=all&page=1&pageSize=5`);
    assert.equal(page.status, 200);
    assert.equal((await page.json() as { pageSize: number }).pageSize, 5);

    const invalid = await fetch(`${url}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 1,
        title: '',
        description: 'Описание',
        deadline: '2026-11-01',
        price: 100
      })
    });
    assert.equal(invalid.status, 400);

    const missing = await fetch(`${url}/orders/999?userId=1`);
    assert.equal(missing.status, 404);
  } finally {
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});
