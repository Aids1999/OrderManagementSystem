import { Order, OrderStatus } from '../../domain/order.js';
import { PageResult } from '../dto.js';

export interface OrderQuery {
  customerId?: number;
  executorId?: number;
  includeFree?: boolean;
  status?: OrderStatus;
  page: number;
  pageSize: number;
}

export interface OrderRepository {
  findById(id: number): Promise<Order | undefined>;
  findPage(query: OrderQuery): Promise<PageResult<Order>>;
  add(order: Order): Promise<void>;
  update(order: Order): Promise<void>;
  delete(id: number): Promise<void>;
  nextId(): Promise<number>;
}
