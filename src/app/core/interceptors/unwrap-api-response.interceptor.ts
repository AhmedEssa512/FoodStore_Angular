import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';

export const unwrapApiResponseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        const body = event.body;

        if (body?.success) {
          // Replace body with unwrapped data
          return event.clone({ body: body.data });
        }

        return event;
      }

      return event;
    })
  );
};
