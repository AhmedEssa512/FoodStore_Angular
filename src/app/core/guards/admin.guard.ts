import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../../features/profile/models/User';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user?.roles?.includes('Admin')) {
        return true;
      }
      return router.createUrlTree(['/']); // redirect to home if not admin
    })
  );
};
