import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from '@shared/services/spinners/spinner-service';
@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  constructor(private readonly loaderService: SpinnerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.showTransparent();
    return next.handle(req).pipe(finalize(() => this.loaderService.hideTransparent()));
  }
}
