import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { take, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register-user',
  imports: [ReactiveFormsModule, NgIf, CommonModule, RouterLink],
  providers: [ToastrService],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.scss'
})
export class RegisterUserComponent implements OnInit{
 myForm: FormGroup;
  submitted: boolean = false; // Track submission for aria-live
  statusMessage: string = '';
  statusType: 'success' | 'error' | '' = '';

    constructor(
      private authService: AuthService,
      private toastr: ToastrService,
      private router: Router
    ) {
      this.myForm = new FormGroup({
        name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.required)
      });
    }

    ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/user-list']);
    }
  }

    onSubmit() {
      this.submitted = true;
      if (this.myForm.valid) {
        const payload = this.myForm.value;
        this.authService.register(payload)
        .pipe(
          take(1),
          tap((data:any) => {
            if(data.status !== 1) {
              this.statusType = 'error';
              this.statusMessage = data?.message || 'Error message!';
              this.toastr.error('Error message!', data?.message);
              this.myForm.reset();
              return;
            }
            this.statusType = 'success';
            this.statusMessage = data?.message || 'Success message!';
            this.toastr.success('Success message!', data?.message);
            this.myForm.reset();
            this.authService.setUser(data?.user);
            this.router.navigate(['/setup-mfa']);
          }),
        )
        .subscribe();
      } else {
        this.statusType = 'error';
        this.statusMessage = 'Please fill out all required fields.';
      }
    }

}
