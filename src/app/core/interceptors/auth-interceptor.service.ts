import { Injectable } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { StorageService } from '../services/storage.service';
import { API_CONFIGURATION } from 'src/configurations/api.configuration';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{
    
    constructor(private theStorageService: StorageService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let localUser = this.theStorageService.getLocalUser();

        let N = API_CONFIGURATION.baseUrl.length;
        let requestToAPI = req.url.substring(0, N) == API_CONFIGURATION.baseUrl;

        if (localUser && requestToAPI) {
            const authReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + localUser.theToken) });
            return next.handle(authReq);
        }
        else {
            return next.handle(req);
        }
    }
}

export const AuthInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true,
};