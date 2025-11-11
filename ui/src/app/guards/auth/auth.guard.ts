import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.isLoggedIn || authService.isTokenExpired()) {
    authService.clearStorage();
    router.navigate(['/login']);
    return false;
  }
  return true;
};
