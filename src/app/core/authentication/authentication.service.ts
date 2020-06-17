import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { JwtHelperService } from "@auth0/angular-jwt";

import { IAutenticacaoDTO } from 'src/app/shared/models/domain/iautenticacao-dto';
import { API_CONFIGURATION } from 'src/configurations/api.configuration';
import { ILocalUser } from 'src/app/shared/models/domain/ilocal-user';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private theJwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private theStorageService: StorageService,
    private router: Router
  ) { }

  authenticate(theAutenticacao: IAutenticacaoDTO) {
    return this.http.post(
      API_CONFIGURATION.baseUrl + "/login",
      theAutenticacao,
      {
        observe: 'response',
        responseType: 'text'
      }
    );
  }

  logout() {
    this.theStorageService.setLocalUser(null);
    this.onReloadRoute('');
  }

  onReloadRoute(url: string) {
    this.router.navigateByUrl(url, { skipLocationChange: false })
      .then(() => this.router.navigate([url]));
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      location.reload();
      return false;      
    };
  }

  refreshToken() {
    return this.http.post(
      API_CONFIGURATION.baseUrl + "/auth/refresh_token",
      {},
      {
        observe: 'response',
        responseType: 'text'
      }
    );
  }

  successFulLogin(theAutorizationValue: String,
    tipoUsuario: string,
    uriImgPerfil: string,
    matricula: string) {
    let theToken = theAutorizationValue.substring(7);
    let theUser: ILocalUser = {
      theToken: theToken,
      theEmail: this.theJwtHelper.decodeToken(theToken).sub,
      theTipoUsuario: Number.parseInt(tipoUsuario),
      theUriImgPerfil: uriImgPerfil,
      theMatricula: matricula
    }
    this.theStorageService.setLocalUser(theUser);
    this.onReloadRoute('');
  }
}
