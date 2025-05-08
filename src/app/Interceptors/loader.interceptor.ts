import { HttpInterceptorFn } from '@angular/common/http';
import { LoadingService } from '../Services/loading.service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  const skipLoader = req.url.includes('/refresh-token') || req.url.includes('/is-authenticated');

  if (!skipLoader) {
    loadingService.show(); 
  }
  
  return next(req).pipe(
    finalize(() => {
      if(!skipLoader)
      {
        loadingService.hide();
      }    
    }
  ));
};
