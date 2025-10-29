import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'; 
import { UserService } from '../../services/user.service';
import { take, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  imports: [ReactiveFormsModule, NgIf, CommonModule],
  providers: [ToastrService],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {
  myForm: FormGroup;
  submitted: boolean = false; // Track submission for aria-live
  statusMessage: string = '';
  statusType: 'success' | 'error' | '' = '';

    constructor(
      private userService: UserService,
      private toastr: ToastrService,
      private router: Router
    ) {
      this.myForm = new FormGroup({
        name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email])
      });
    }

    onSubmit() {
      this.submitted = true;
      if (this.myForm.valid) {
        const payload = this.myForm.value;
        this.userService.addUser(payload)
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
            this.router.navigate(['/user-list']);
          }),
        )
        .subscribe();
      } else {
        this.statusType = 'error';
        this.statusMessage = 'Please fill out all required fields.';
      }
    }

}
