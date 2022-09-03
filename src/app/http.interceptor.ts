import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpInterceptor,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./shared/auth.service";
import {tap} from 'rxjs/operators';
import { Router } from "@angular/router";
@Injectable()
export class XhrInterceptor implements HttpInterceptor {
  slugId: any;

  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const user = localStorage.getItem("user");
    const userObject = JSON.parse(user);
    if (userObject) {
      this.slugId = userObject.slug_id;
    }

    request = request.clone({
      headers: request.headers.set("slug-id", `${this.slugId}`),
    });
    return next.handle(request).pipe( tap(() => {},
    (err: any) => {
    if (err instanceof HttpErrorResponse) {
      if (err.status !== 401) {
       return;
      }
      localStorage.clear();
      this.router.navigate(["/"]);
    }
  }));
  }
}
