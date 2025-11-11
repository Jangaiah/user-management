import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit, OnDestroy {
  private sub: Subscription = new Subscription();
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.sub.add(this.authService.logout()
    .subscribe(() => {
        this.router.navigate(['/login']);
      })
    );
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
