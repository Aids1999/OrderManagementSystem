import { Injectable } from '@angular/core';
import { Order, OrderForm, OrderStatus, User } from '../models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  // Пока сервера нет, заказы хранятся в обычном массиве.
  private orders: Order[] = [
    {
      id: 1,
      title: 'Создать логотип',
      description: 'Нужен простой логотип для сайта',
      deadline: '2026-10-20',
      price: 5000,
      status: 'new',
      customerId: 1,
      executorId: null
    }
  ];

  getOrders(user: User, status: OrderStatus | 'all'): Order[] {
    const visible = user.role === 'customer'
      ? this.orders.filter(order => order.customerId === user.id)
      : this.orders.filter(order => order.status === 'new' || order.executorId === user.id);

    return status === 'all' ? visible : visible.filter(order => order.status === status);
  }

  getOrder(id: number, customerId: number): Order | undefined {
    return this.orders.find(order => order.id === id && order.customerId === customerId);
  }

  createOrder(form: OrderForm, customerId: number): void {
    this.orders.push({
      id: this.nextId(),
      ...form,
      status: 'new',
      customerId,
      executorId: null
    });
  }

  updateOrder(id: number, form: OrderForm, customerId: number): void {
    const order = this.getOrder(id, customerId);
    if (order?.status === 'new') {
      Object.assign(order, form);
    }
  }

  deleteOrder(id: number, customerId: number): void {
    this.orders = this.orders.filter(order =>
      order.id !== id || order.customerId !== customerId || order.status !== 'new'
    );
  }

  acceptOrder(id: number, executorId: number): void {
    const order = this.orders.find(item => item.id === id && item.status === 'new');
    if (order) {
      order.executorId = executorId;
      order.status = 'in_progress';
    }
  }

  completeOrder(id: number, executorId: number): void {
    const order = this.orders.find(item => item.id === id && item.executorId === executorId);
    if (order) {
      order.status = 'completed';
    }
  }

  private nextId(): number {
    return Math.max(0, ...this.orders.map(order => order.id)) + 1;
  }
}
