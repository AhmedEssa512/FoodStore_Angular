import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorHandlerService } from '../services/http-error-handler.service';
import { catchError } from 'rxjs';
import { inject } from '@angular/core';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
   const errorHandler = inject(HttpErrorHandlerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
    
      return errorHandler.handleError(error);
    })
  );
};
