import { Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserManagementComponent } from './pages/users/user-management.component';
import { CardManagementComponent } from './pages/cards/card-management.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'usuarios', component: UserManagementComponent },
  { path: 'cartoes', component: CardManagementComponent },
  { path: '**', redirectTo: 'dashboard' }
];
