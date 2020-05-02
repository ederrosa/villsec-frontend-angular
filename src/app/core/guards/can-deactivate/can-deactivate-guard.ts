import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { ICanDeactivate } from 'src/app/shared/models/domain/icandeactivate';


@Injectable({
    providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<ICanDeactivate>{

    constructor() { }

    canDeactivate(
        component: ICanDeactivate,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return component.canDeactivate();
    }
}
