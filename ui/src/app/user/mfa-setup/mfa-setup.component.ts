import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import e from 'express';

@Component({
  selector: 'app-mfa-setup',
  imports: [FormsModule, CommonModule],
  templateUrl: './mfa-setup.component.html',
  styleUrl: './mfa-setup.component.scss'
})
export class MfaSetupComponent {
  qrCode = '';
  code = '';
  message = '';
  success = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user?.id) {
      this.authService.generateMfa(user?.id).subscribe({
        next: (res) => {
          this.qrCode = res.qr;
        },
        error: () => {
          this.message = 'Failed to load MFA QR code';
        }
      });
    } else {
      this.message = 'Session expired. Please register again.';
    }
  }

  verifyCode() {
    const user =  this.authService.getUser();
    if (!user?.id) return;

    this.authService.verifyMfaSetup(user?.id, this.code).subscribe({
      next: (res) => {
        this.message = res.message;
        this.success = true;
        this.authService.setUser(res.user);
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.message = err.error.message || 'Invalid code';
        this.success = false;
      }
    });
  }
}
