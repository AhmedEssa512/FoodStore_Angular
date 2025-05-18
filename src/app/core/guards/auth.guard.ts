import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, map, of, switchMap, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthStatus().pipe(
    map(response => {
      if (response.isAuthenticated) {
        return true;
      } else {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    }),
    catchError(err => {
      if (err.status === 401) {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      }
      return of(false);
    })
  );
 
};
