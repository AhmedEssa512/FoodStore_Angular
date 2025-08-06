import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerService {

   constructor() { }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unexpected error occurred. Please try again.';
    
      // Handle HTTP errors
      if (typeof window !== 'undefined' && error.error instanceof window.ErrorEvent) {
        errorMessage = 'Something went wrong. Please check your connection.';
      } else {
        switch (error.status) {
          case 0:
            errorMessage = 'Network issue. Please check your internet connection.';
            break;
          case 400:
          if (error.error?.data) {
          // Backend validation errors
          return throwError(() => ({
            message: error.error.message || 'Validation failed',
            validationErrors: error.error.data
          }));
        }
        errorMessage = error.error?.message || 'Invalid request.';
            break;
          case 401:
            errorMessage = 'Session expired. Please log in again.';
            break;
          case 403:
            errorMessage = 'You are not authorized to perform this action.';
            break;
          case 404:
            errorMessage = 'Requested resource was not found.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = `An unexpected error occurred. Status: ${error.status}`;
            break;
        }
      
      }
    

    console.error('Error occurred:', error); // untill implement logging

    return throwError(() => new Error(errorMessage));
   }
  }
  
