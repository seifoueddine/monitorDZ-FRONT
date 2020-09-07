import { Injectable } from '@angular/core';
import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './shared/auth.service';


@Injectable()
export class XhrInterceptor implements HttpInterceptor {
    slugId: any;

    constructor() {
     }

    intercept(request: HttpRequest<any>, next: HttpHandler, ): Observable<HttpEvent<any>> {
        const user = localStorage.getItem('user');
        const userObject =  JSON.parse(user)
         if (userObject) {
            this.slugId = userObject.slug_id;
         }
     
           request = request.clone({headers: request.headers.set('slug-id', `${this.slugId}` )});
        return next.handle(request);
    }
}
