import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  form = { name: '', email: '', password: '' };
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  register(): void {
    if (this.auth.register(this.form.name, this.form.email, this.form.password)) {
      this.router.navigate(['/orders']);
    } else {
      this.error = 'Пользователь с таким email уже существует';
    }
  }
}
