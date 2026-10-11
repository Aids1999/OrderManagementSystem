import { date, positiveInteger, positiveNumber, requiredString } from './guard.js';
import { DomainError } from './domain-error.js';
import { User } from './user.js';

export type OrderStatus = 'new' | 'in_progress' | 'completed';

export interface OrderData {
  title: unknown;
  description: unknown;
  deadline: unknown;
  price: unknown;
}

export class Order {
  readonly id: number;
  readonly customerId: number;
  title: string;
  description: string;
  deadline: string;
  price: number;
  status: OrderStatus;
  executorId: number | null;

  constructor(
    id: unknown,
    data: OrderData,
    customerId: unknown,
    status: OrderStatus = 'new',
    executorId: number | null = null
  ) {
    this.id = positiveInteger(id, 'Идентификатор заказа');
    this.customerId = positiveInteger(customerId, 'Идентификатор заказчика');
    this.title = requiredString(data.title, 'Название', 100);
    this.description = requiredString(data.description, 'Описание', 1000);
    this.deadline = date(data.deadline);
    this.price = positiveNumber(data.price, 'Стоимость');
    if (status !== 'new' && status !== 'in_progress' && status !== 'completed') {
      throw new DomainError('Некорректный статус заказа');
    }
    this.status = status;
    this.executorId = executorId === null
      ? null
      : positiveInteger(executorId, 'Идентификатор исполнителя');
  }

  update(data: OrderData, customer: User): void {
    if (customer.role !== 'customer' || customer.id !== this.customerId || this.status !== 'new') {
      throw new DomainError('Изменять можно только свой новый заказ');
    }
    this.title = requiredString(data.title, 'Название', 100);
    this.description = requiredString(data.description, 'Описание', 1000);
    this.deadline = date(data.deadline);
    this.price = positiveNumber(data.price, 'Стоимость');
  }

  accept(executor: User): void {
    if (executor.role !== 'executor' || this.status !== 'new') {
      throw new DomainError('Заказ нельзя принять');
    }
    this.executorId = executor.id;
    this.status = 'in_progress';
  }

  complete(executor: User): void {
    if (executor.role !== 'executor' || this.executorId !== executor.id || this.status !== 'in_progress') {
      throw new DomainError('Завершить можно только принятый заказ');
    }
    this.status = 'completed';
  }
}
