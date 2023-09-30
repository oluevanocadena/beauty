import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  private readonly destroy$ = new Subject<void>();

  constructor(
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        takeUntil(this.destroy$),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            // Do something if the user is unauthorized.
          }
          return throwError(error);
        })
      );
  }

  cancelPendingRequests(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToRoute(route: string): void {
    this.cancelPendingRequests();
    this.router.navigateByUrl(route);
  }
}
