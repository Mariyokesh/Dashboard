import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const resource = route.data['resource'] as string;

  return forkJoin({
    userRole: authService.getUserRoleFromApi(),
    resourceRoles: authService.getResourceRoles()
  }).pipe(
    map(({ userRole, resourceRoles }) => {
      const allowedRoles = resourceRoles[resource] || [];
      
      if (allowedRoles.some(r => r.toLowerCase() === userRole.toLowerCase())) {
        return true;
      } else {
        alert('Access denied - Insufficient permissions');
        return false;
      }
    }),
    catchError((err) => {
      console.error('Role check failed', err);
      router.navigate(['/login']);
      return of(false);
    })
  );
};
