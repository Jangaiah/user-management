import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', redirectTo: 'user-list', pathMatch: 'full'
    },
    {
        path: 'user-list',
        loadComponent: () => import('./user/user-list/user-list.component')
                        .then(c => c.UserListComponent)
    },
    {
        path: 'user-new',
        loadComponent: () => import('./user/add-user/add-user.component')
                        .then(c => c.AddUserComponent)
    }
];
