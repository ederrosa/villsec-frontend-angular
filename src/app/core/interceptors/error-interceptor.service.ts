import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HTTP_INTERCEPTORS,
  HttpErrorResponse
} from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { StorageService } from '../services/storage.service';
import { InformativeAlertComponent } from 'src/app/shared/components/alerts/informative-alert/informative-alert.component';

export interface IError {

  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface FieldMessage {
  field: string;
  defaultMessage: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(
    private theStorageService: StorageService,
    private dialog: MatDialog
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorObj = error;
        if (errorObj.error) {
          errorObj = errorObj.error;
        }
        switch (error.status) {
          case 401:
            this.handle401();
            break;
          case 403:
            this.handle403();
            break;
          case 422:
            this.handle422(errorObj);
            break;
          default:
            this.handleDefaultError(error);
        }
        return throwError(errorObj);
      })
    );
  }

  handle401() {
    this.theStorageService.setLocalUser(null);
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: false, width: '40%' });
    let instance = dialogRef.componentInstance;
    instance.title = 'Status 401 !.. ';
    instance.subTitle = 'Unauthorized'
    instance.classCss = 'color-danger';
    instance.message = 'Access Denied! | Acesso Negado!, Login ou Senha incorreta...';
  }

  handle403() {
    this.theStorageService.setLocalUser(null);
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
    let instance = dialogRef.componentInstance;
    instance.title = 'Status 403 !.. ';
    instance.subTitle = 'Forbidden'
    instance.classCss = 'color-danger';
    instance.message = 'Access Denied! | Acesso Negado!, faça o login e tente novamente...';
    instance.urlNavigate = '/login';
  }

  handle422(errorObj) {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
    let instance = dialogRef.componentInstance;
    instance.title = `Status '${errorObj.status}  ${errorObj.statusText} !... `;
    instance.subTitle = `Unprocessable Entity (${errorObj.name})`;
    instance.classCss = 'color-danger';
    instance.message =
      `Mensagem: ${errorObj.message} 
             Status: ${errorObj.statusText} 
             Objeto do Erro:  ${errorObj.error} `;
  }

  handleDefaultError(errorObj) {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
    let instance = dialogRef.componentInstance;
    instance.classCss = 'color-danger';
    if (errorObj.error != null) {
      let error = JSON.parse(errorObj.error) as IError;
      instance.title = `${error.status} Status: ${errorObj.statusText} !... `;
      instance.subTitle = `Error: ${error.error}`;
      instance.message = this.listErrors(error['errors']);
    } else {
      instance.title = `Status '${errorObj.status}  ${errorObj.statusText} !... `;
      instance.subTitle = errorObj.name;
      instance.message = `Mensagem: ${errorObj.message} Status: ${errorObj.statusText} `;
    }

  }

  private listErrors(messages: FieldMessage[]): string {
    let s: string = '';
    for (var i = 0; i < messages.length; i++) {
      s = s + '<p><strong>' + messages[i].field + "</strong>: " + messages[i].defaultMessage + '</p>';
    }
    return s;
  }
}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptorService,
  multi: true,
};