import cors from 'cors';
import express from 'express';
import { AuthService } from '../application/services/auth.service.js';
import { OrderService } from '../application/services/order.service.js';
import { ProfileService } from '../application/services/profile.service.js';
import { InMemoryOrderRepository } from '../infrastructure/in-memory-order.repository.js';
import { InMemoryUserRepository } from '../infrastructure/in-memory-user.repository.js';
import { authController } from './controllers/auth.controller.js';
import { orderController } from './controllers/order.controller.js';
import { profileController } from './controllers/profile.controller.js';
import { errorHandler } from './error-handler.js';

export function createApp() {
  const users = new InMemoryUserRepository();
  const orders = new InMemoryOrderRepository();
  const app = express();

  app.use(cors({ origin: ['http://localhost:4200', 'http://127.0.0.1:4200'] }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', (_request, response) => response.status(200).json({ status: 'ok' }));
  app.use('/api/auth', authController(new AuthService(users)));
  app.use('/api/orders', orderController(new OrderService(orders, users)));
  app.use('/api/profile', profileController(new ProfileService(users)));

  app.use((_request, response) => response.status(404).json({ message: 'Адрес не найден' }));
  app.use(errorHandler);
  return app;
}
