import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-mfa',
  imports: [FormsModule, CommonModule],
  templateUrl: './verify-mfa.component.html',
  styleUrl: './verify-mfa.component.scss'
})
export class VerifyMfaComponent {
code = '';
  message = '';
  success = false;

  constructor(private authService: AuthService, private router: Router) {}

  verifyMfa() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.message = 'Session expired. Please login again.';
      this.success = false;
      return;
    }

    this.authService.verifyMfa(userId, this.code).subscribe({
      next: (res) => {
        this.message = res.message;
        this.success = true;
        setTimeout(() => this.router.navigate(['/user-list']), 1000);
      },
      error: (err) => {
        this.message = err.error.message || 'Invalid MFA code';
        this.success = false;
      }
    });
  }
}
