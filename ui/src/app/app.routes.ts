import { Routes } from '@angular/router';
import { authGuard } from './guards/auth/auth.guard';
import { mfaGuard } from './guards/mfa/mfa.guard';

export const routes: Routes = [
    {
        path: '', redirectTo: 'login', pathMatch: 'full'
    },
    {
        path: 'user-list',
        loadComponent: () => import('./user/user-list/user-list.component')
                        .then(c => c.UserListComponent),
        canActivate: [authGuard]
    },
    {
        path: 'register',
        loadComponent: () => import('./user/register-user/register-user.component')
                        .then(c => c.RegisterUserComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./user/login/login.component')
                        .then(c => c.LoginComponent)
    },
    {
        path: 'logout',
        loadComponent: () => import('./features/logout/logout.component')
                        .then(c => c.LogoutComponent),
        canActivate: [authGuard]
    },
    {   path: 'setup-mfa',
        loadComponent: () => import('./user/mfa-setup/mfa-setup.component')
                        .then(c => c.MfaSetupComponent),
        canActivate: [mfaGuard]
    },
    { 
        path: 'verify-mfa', loadComponent: () => import('./user/verify-mfa/verify-mfa.component')
                        .then(c => c.VerifyMfaComponent),
        canActivate: [mfaGuard]
    },

];
