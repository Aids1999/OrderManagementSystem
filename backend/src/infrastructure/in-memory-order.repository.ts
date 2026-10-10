import {
  OrderQuery,
  OrderRepository
} from '../application/repositories/order.repository.js';
import { PageResult } from '../application/dto.js';
import { DomainError } from '../domain/domain-error.js';
import { positiveInteger } from '../domain/guard.js';
import { Order } from '../domain/order.js';

export class InMemoryOrderRepository implements OrderRepository {
  private orders: Order[] = [
    new Order(
      1,
      {
        title: 'Создать логотип',
        description: 'Нужен простой логотип для сайта',
        deadline: '2026-10-20',
        price: 5000
      },
      1
    )
  ];

  async findById(idValue: number): Promise<Order | undefined> {
    const id = positiveInteger(idValue, 'Идентификатор заказа');
    return this.orders.find(order => order.id === id);
  }

  async findPage(query: OrderQuery): Promise<PageResult<Order>> {
    const page = positiveInteger(query?.page, 'Номер страницы');
    const pageSize = positiveInteger(query?.pageSize, 'Размер страницы');
    if (query.status !== undefined && !['new', 'in_progress', 'completed'].includes(query.status)) {
      throw new DomainError('Некорректный статус заказа');
    }
    if (query.includeFree !== undefined && typeof query.includeFree !== 'boolean') {
      throw new DomainError('Некорректный параметр свободных заказов');
    }
    const customerId = query.customerId === undefined
      ? undefined
      : positiveInteger(query.customerId, 'Идентификатор заказчика');
    const executorId = query.executorId === undefined
      ? undefined
      : positiveInteger(query.executorId, 'Идентификатор исполнителя');
    let items = [...this.orders];

    if (customerId) {
      items = items.filter(order => order.customerId === customerId);
    }
    if (executorId) {
      items = items.filter(order =>
        order.executorId === executorId || Boolean(query.includeFree && order.status === 'new')
      );
    }
    if (query.status) {
      items = items.filter(order => order.status === query.status);
    }

    const total = items.length;
    const start = (page - 1) * pageSize;
    return {
      items: items.slice(start, start + pageSize),
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  async add(order: Order): Promise<void> {
    if (!(order instanceof Order) || this.orders.some(item => item.id === order.id)) {
      throw new DomainError('Некорректный заказ');
    }
    this.orders.push(order);
  }

  async update(order: Order): Promise<void> {
    if (!(order instanceof Order) || !this.orders.some(item => item.id === order.id)) {
      throw new DomainError('Заказ не найден');
    }
  }

  async delete(idValue: number): Promise<void> {
    const id = positiveInteger(idValue, 'Идентификатор заказа');
    this.orders = this.orders.filter(order => order.id !== id);
  }

  async nextId(): Promise<number> {
    return Math.max(0, ...this.orders.map(order => order.id)) + 1;
  }
}
