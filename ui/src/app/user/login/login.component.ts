import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf, CommonModule, RouterLink],
  providers: [ToastrService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  myForm: FormGroup;
  message: string = '';
  success: boolean = false;
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.myForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/user-list']);
    } else if(user?.id && !user?.isMfaEnabled) {
      this.router.navigate(['/setup-mfa']);
    }
  }

  onSubmit() {
    this.myForm.markAllAsTouched();
    if (this.myForm.valid) {
      const payload = this.myForm.value;
      this.authService.login(payload).subscribe({
        next: (data: any) => {
          if (data.status !== 1) {
            this.message = data?.message || 'Error during login!';
            this.success = false;
            return;
          }
          this.success = true;
          this.toastr.success('Login Successful', data?.message || 'Welcome back!');
          this.router.navigate(['/verify-mfa']);
        },
        error: (err: any) => {
          this.success = false;
          this.message = (err?.error?.message || err?.message ) || 'An error occurred during login.';
        }
      });
    } else {
      this.success = false;
      this.message = 'Please fill out all required fields correctly.';
    }
  }

}
