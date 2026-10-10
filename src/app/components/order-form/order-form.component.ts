import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { apiErrorMessage } from '../../api.config';
import { OrderForm } from '../../models';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './order-form.component.html'
})
export class OrderFormComponent implements OnInit {
  form: OrderForm = { title: '', description: '', deadline: '', price: 0 };
  orderId: number | null = null;
  error = '';

  constructor(
    private auth: AuthService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user || user.role !== 'customer') {
      this.router.navigate(['/login']);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderId = Number(id);
      try {
        const order = await this.orderService.getOrder(this.orderId, user.id);
        this.form = {
          title: order.title,
          description: order.description,
          deadline: order.deadline,
          price: order.price
        };
      } catch (error) {
        this.error = apiErrorMessage(error);
      }
    }
  }

  async save(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      return;
    }

    try {
      if (this.orderId) {
        await this.orderService.updateOrder(this.orderId, this.form, user.id);
      } else {
        await this.orderService.createOrder(this.form, user.id);
      }
      this.router.navigate(['/orders']);
    } catch (error) {
      this.error = apiErrorMessage(error);
    }
  }
}
