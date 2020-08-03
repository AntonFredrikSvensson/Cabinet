import { HttpCasheService } from './http-cashe.service';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/Operators';


@Injectable()
    export class CacheInterceptor implements HttpInterceptor {

    constructor(private casheService: HttpCasheService){ }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{

        // pass along non GET requests and invalidate cashe for these urls
        // if (req.method !== 'GET'){
        //     console.log(`invalidating cashe: ${req.method} ${req.url}`);
        //     this.casheService.invalidateUrl(req.urlWithParams);
        //     return next.handle(req);
        // }

        // attempt to retreive a cashed response
        const cashedResponse: HttpResponse<any> = this.casheService.get(req.urlWithParams);

        // return cashed reaponse
        if (cashedResponse) {
            // console.log(`Returning cashed response: ${cashedResponse.url}`);
            // console.log(req);
            // console.log(cashedResponse);
            return of(cashedResponse);
        }

        // send request to server and add response to cashe
        return next.handle(req)
        .pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    // console.log(`Adding item to cashe ${req.urlWithParams}`);
                    // console.log(req);
                    this.casheService.put(req.urlWithParams, event);
                }
            })
        );
    }
}
