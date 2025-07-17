import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

   return authService.getAuthStatusOnce().pipe(
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      }

      //  This is where we force a redirect
      // authService.logout({ redirect: true }); 
      
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      });
    })
  );
 
};


