import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { apiErrorMessage } from '../../api.config';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  form = { email: 'customer@mail.ru', password: '123456' };
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  async login(): Promise<void> {
    try {
      await this.auth.login(this.form.email, this.form.password);
      this.router.navigate(['/orders']);
    } catch (error) {
      this.error = apiErrorMessage(error);
    }
  }
}
