import { DomainError } from '../../domain/domain-error.js';
import { positiveInteger } from '../../domain/guard.js';
import { Order, OrderStatus } from '../../domain/order.js';
import { User } from '../../domain/user.js';
import { OrderDto, OrderInput, PageResult } from '../dto.js';
import { ForbiddenError, NotFoundError } from '../errors.js';
import { toOrderDto } from '../mappers.js';
import { OrderQuery, OrderRepository } from '../repositories/order.repository.js';
import { UserRepository } from '../repositories/user.repository.js';

export class OrderService {
  constructor(
    private readonly orders: OrderRepository,
    private readonly users: UserRepository
  ) {}

  async getPage(
    userIdValue: unknown,
    statusValue: unknown,
    pageValue: unknown,
    pageSizeValue: unknown
  ): Promise<PageResult<OrderDto>> {
    const user = await this.findUser(userIdValue);
    const page = positiveInteger(pageValue, 'Номер страницы');
    const pageSize = positiveInteger(pageSizeValue, 'Размер страницы');
    if (pageSize > 100) {
      throw new DomainError('Размер страницы не должен превышать 100');
    }

    const query: OrderQuery = { page, pageSize };
    const status = this.parseStatus(statusValue);
    if (status) {
      query.status = status;
    }
    if (user.role === 'customer') {
      query.customerId = user.id;
    } else {
      query.executorId = user.id;
      query.includeFree = true;
    }

    const result = await this.orders.findPage(query);
    return { ...result, items: result.items.map(toOrderDto) };
  }

  async getById(idValue: unknown, userIdValue: unknown): Promise<OrderDto> {
    const user = await this.findUser(userIdValue);
    const order = await this.findOrder(idValue);
    const visible = user.role === 'customer'
      ? order.customerId === user.id
      : order.status === 'new' || order.executorId === user.id;
    if (!visible) {
      throw new ForbiddenError('Нет доступа к заказу');
    }
    return toOrderDto(order);
  }

  async create(userIdValue: unknown, input: OrderInput): Promise<OrderDto> {
    const user = await this.findUser(userIdValue);
    if (user.role !== 'customer') {
      throw new ForbiddenError('Заказы создаёт только заказчик');
    }
    const order = new Order(await this.orders.nextId(), input, user.id);
    await this.orders.add(order);
    return toOrderDto(order);
  }

  async update(idValue: unknown, userIdValue: unknown, input: OrderInput): Promise<void> {
    const user = await this.findUser(userIdValue);
    const order = await this.findOrder(idValue);
    order.update(input, user);
    await this.orders.update(order);
  }

  async delete(idValue: unknown, userIdValue: unknown): Promise<void> {
    const user = await this.findUser(userIdValue);
    const order = await this.findOrder(idValue);
    if (user.id !== order.customerId || order.status !== 'new') {
      throw new ForbiddenError('Удалять можно только свой новый заказ');
    }
    await this.orders.delete(order.id);
  }

  async accept(idValue: unknown, userIdValue: unknown): Promise<void> {
    const user = await this.findUser(userIdValue);
    const order = await this.findOrder(idValue);
    order.accept(user);
    await this.orders.update(order);
  }

  async setStatus(idValue: unknown, userIdValue: unknown, statusValue: unknown): Promise<void> {
    if (statusValue !== 'completed') {
      throw new DomainError('Допустимый новый статус: completed');
    }
    const user = await this.findUser(userIdValue);
    const order = await this.findOrder(idValue);
    order.complete(user);
    await this.orders.update(order);
  }

  private async findUser(value: unknown): Promise<User> {
    const id = positiveInteger(value, 'Идентификатор пользователя');
    const user = await this.users.findById(id);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return user;
  }

  private async findOrder(value: unknown): Promise<Order> {
    const id = positiveInteger(value, 'Идентификатор заказа');
    const order = await this.orders.findById(id);
    if (!order) {
      throw new NotFoundError('Заказ не найден');
    }
    return order;
  }

  private parseStatus(value: unknown): OrderStatus | undefined {
    if (value === undefined || value === 'all') {
      return undefined;
    }
    if (value !== 'new' && value !== 'in_progress' && value !== 'completed') {
      throw new DomainError('Некорректный статус');
    }
    return value;
  }
}
