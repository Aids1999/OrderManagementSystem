import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { apiErrorMessage } from '../../api.config';
import { Order, OrderStatus, User } from '../../models';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './order-list.component.html'
})
export class OrderListComponent implements OnInit {
  filter: OrderStatus | 'all' = 'all';
  orders: Order[] = [];
  page = 1;
  totalPages = 0;
  error = '';

  constructor(
    public auth: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.auth.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    void this.loadOrders();
  }

  get user(): User | null {
    return this.auth.currentUser;
  }

  async loadOrders(): Promise<void> {
    if (!this.user) {
      return;
    }
    try {
      const result = await this.orderService.getOrders(this.user.id, this.filter, this.page);
      this.orders = result.items;
      this.totalPages = result.totalPages;
      this.error = '';
    } catch (error) {
      this.error = apiErrorMessage(error);
    }
  }

  changeFilter(): void {
    this.page = 1;
    void this.loadOrders();
  }

  changePage(step: number): void {
    this.page += step;
    void this.loadOrders();
  }

  async deleteOrder(id: number): Promise<void> {
    if (this.user) {
      try {
        await this.orderService.deleteOrder(id, this.user.id);
        await this.loadOrders();
      } catch (error) {
        this.error = apiErrorMessage(error);
      }
    }
  }

  async acceptOrder(id: number): Promise<void> {
    if (this.user) {
      try {
        await this.orderService.acceptOrder(id, this.user.id);
        await this.loadOrders();
      } catch (error) {
        this.error = apiErrorMessage(error);
      }
    }
  }

  async completeOrder(id: number): Promise<void> {
    if (this.user) {
      try {
        await this.orderService.completeOrder(id, this.user.id);
        await this.loadOrders();
      } catch (error) {
        this.error = apiErrorMessage(error);
      }
    }
  }

  statusText(status: OrderStatus): string {
    return { new: 'Новый', in_progress: 'В работе', completed: 'Выполнен' }[status];
  }
}
