import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { resource: 'dashboard' }
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
