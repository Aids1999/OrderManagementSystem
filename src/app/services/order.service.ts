import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../api.config';
import { Order, OrderForm, OrderStatus, PageResult } from '../models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  getOrders(
    userId: number,
    status: OrderStatus | 'all',
    page: number,
    pageSize = 5
  ): Promise<PageResult<Order>> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('status', status)
      .set('page', page)
      .set('pageSize', pageSize);
    return firstValueFrom(this.http.get<PageResult<Order>>(`${API_URL}/orders`, { params }));
  }

  getOrder(id: number, userId: number): Promise<Order> {
    const params = new HttpParams().set('userId', userId);
    return firstValueFrom(this.http.get<Order>(`${API_URL}/orders/${id}`, { params }));
  }

  createOrder(form: OrderForm, userId: number): Promise<Order> {
    return firstValueFrom(this.http.post<Order>(`${API_URL}/orders`, { ...form, userId }));
  }

  async updateOrder(id: number, form: OrderForm, userId: number): Promise<void> {
    await firstValueFrom(this.http.put<void>(`${API_URL}/orders/${id}`, { ...form, userId }));
  }

  async deleteOrder(id: number, userId: number): Promise<void> {
    const params = new HttpParams().set('userId', userId);
    await firstValueFrom(this.http.delete<void>(`${API_URL}/orders/${id}`, { params }));
  }

  async acceptOrder(id: number, userId: number): Promise<void> {
    await firstValueFrom(this.http.put<void>(`${API_URL}/orders/${id}/accept`, { userId }));
  }

  async completeOrder(id: number, userId: number): Promise<void> {
    await firstValueFrom(this.http.put<void>(`${API_URL}/orders/${id}/status`, {
      userId,
      status: 'completed'
    }));
  }
}
