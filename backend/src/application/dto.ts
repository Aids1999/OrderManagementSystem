import { OrderStatus, OrderData } from '../domain/order.js';
import { Role } from '../domain/user.js';

export interface UserDto {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface OrderDto {
  id: number;
  title: string;
  description: string;
  deadline: string;
  price: number;
  status: OrderStatus;
  customerId: number;
  executorId: number | null;
}

export interface PageResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface LoginInput {
  email: unknown;
  password: unknown;
}

export interface RegisterInput extends LoginInput {
  name: unknown;
}

export interface ProfileInput {
  name: unknown;
  email: unknown;
}

export type OrderInput = OrderData;
