import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { inject } from '@angular/core';

export const mfaGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
    const router = inject(Router);
    const userId = authService.getUserId();
    if (!userId) {
      router.navigate(['/login']);
      return false;
    }
  return true;
};
