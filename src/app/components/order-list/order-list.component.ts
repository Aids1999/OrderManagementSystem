import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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

  constructor(
    public auth: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.auth.currentUser) {
      this.router.navigate(['/login']);
    }
  }

  get user(): User | null {
    return this.auth.currentUser;
  }

  get orders(): Order[] {
    return this.user ? this.orderService.getOrders(this.user, this.filter) : [];
  }

  deleteOrder(id: number): void {
    if (this.user) {
      this.orderService.deleteOrder(id, this.user.id);
    }
  }

  acceptOrder(id: number): void {
    if (this.user) {
      this.orderService.acceptOrder(id, this.user.id);
    }
  }

  completeOrder(id: number): void {
    if (this.user) {
      this.orderService.completeOrder(id, this.user.id);
    }
  }

  statusText(status: OrderStatus): string {
    return { new: 'Новый', in_progress: 'В работе', completed: 'Выполнен' }[status];
  }
}
