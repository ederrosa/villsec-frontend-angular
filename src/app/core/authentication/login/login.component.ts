import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UnsubscribeControlService } from '../../services/unsubscribe-control.service';
import { DialogOverviewForgetPasswordComponent } from '../dialog-overview-forget-password/dialog-overview-forget-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private theInscricao: Subscription[] = new Array<Subscription>();
  private theSignInForm: FormGroup;
  
  constructor(
    private dialog: MatDialog,
    private theAuthenticationService: AuthenticationService,
    private theFormBuilder: FormBuilder,
    private theUnsubscribeControl: UnsubscribeControlService
  ) { }

  getTheSignInForm(): FormGroup {
    return this.theSignInForm;
  }

  logout() {
    this.theAuthenticationService.logout();
  }

  ngOnDestroy() {
    this.onClear();
    this.theUnsubscribeControl.unsubscribe(this.theInscricao);
  }

  ngOnInit() {
    this.theSignInForm = this.theFormBuilder.group({
      login: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
      senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    });
  }

  onClear() {
    this.getTheSignInForm().reset();
  }

  OnResetPassword() {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(DialogOverviewForgetPasswordComponent, { });
  }

  onSignIn() {
    let theFormData: FormData = new FormData();
    theFormData.append('login', this.getTheSignInForm().get('login').value);
    theFormData.append('senha', this.getTheSignInForm().get('senha').value);
    this.theInscricao.push(this.theAuthenticationService.authenticate(theFormData).subscribe(response => {
      this.theAuthenticationService.successFulLogin(
        response.headers.get('Authorization'),
        response.headers.get('UserType'),
        response.headers.get('UserUriImgPerfil'),
        response.headers.get('UserMatricula'));
    },
      error => { }));
  }

  onSignUp() {

  }

  viewDidEnter() {
    this.theInscricao.push(this.theAuthenticationService.refreshToken()
      .subscribe(response => {
        this.theAuthenticationService.successFulLogin(
          response.headers.get('Authorization'),
          response.headers.get('UserType'),
          response.headers.get('UserUriImgPerfil'),
          response.headers.get('UserMatricula'));
      },
        error => { }));
  } 
}
