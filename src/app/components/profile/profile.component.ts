import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  form = { name: '', email: '' };
  error = '';

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.auth.currentUser;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.form = { name: user.name, email: user.email };
  }

  save(): void {
    if (this.auth.updateProfile(this.form.name, this.form.email)) {
      this.router.navigate(['/orders']);
    } else {
      this.error = 'Этот email уже занят';
    }
  }
}
