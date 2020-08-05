import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../authentication/authentication.service';
import { ILocalUser } from 'src/app/shared/models/domain/ilocal-user';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardChildSeguidor implements CanActivate {

  private theLocalUser: ILocalUser;

  constructor(
    private theAuthService: AuthenticationService,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (sessionStorage['localUser'] != null) {
      this.theLocalUser = JSON.parse(sessionStorage.getItem('localUser')) as ILocalUser;
      switch (this.theLocalUser.theTipoUsuario) {
        case 1:
          return true;
        case 2:
          return true;
        case 3:
          return true;
        default:          
          return false;
      }
    } else {
      this.theAuthService.logout();
      return false;
    }   
  }
}
