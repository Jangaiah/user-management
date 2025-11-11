import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../common/models/user.model';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [NgIf, RouterLink, AsyncPipe, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
 userLoggedIn = false;
  currentLoggedInUser: Observable<User | null> = of(null);
  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn) {
      this.userLoggedIn = true;
      this.currentLoggedInUser = this.authService.currentUser;
    }
  }
  
  onLogout() {
    this.router.navigate(['/logout']);
  }
}
