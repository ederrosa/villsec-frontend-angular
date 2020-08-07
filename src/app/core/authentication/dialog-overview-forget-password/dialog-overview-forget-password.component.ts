import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';

import { Subscription } from 'rxjs';

import { UnsubscribeControlService } from '../../services/unsubscribe-control.service';
import { AuthenticationService } from '../authentication.service';
import { ProgressSpinnerOverviewComponent } from '../../../shared/components/progress-spinner/progress-spinner-overview/progress-spinner-overview.component';

import { InformativeAlertComponent } from '../../../shared/components/alerts/informative-alert/informative-alert.component';

@Component({
  selector: 'app-dialog-overview-forget-password',
  templateUrl: './dialog-overview-forget-password.component.html',
  styleUrls: ['./dialog-overview-forget-password.component.scss']
})
export class DialogOverviewForgetPasswordComponent implements OnInit, OnDestroy {

  @Input() classCss: string = 'example-margin';
  
  private theFormReset: FormGroup;
  private theInscricao: Subscription[] = new Array<Subscription>();

  constructor(
    private dialog: MatDialog,
    private theAutenticationService: AuthenticationService,
    public dialogRef: MatDialogRef<DialogOverviewForgetPasswordComponent>,
    private TheFormResetBuilder: FormBuilder,
    private theUnsubscribeControl: UnsubscribeControlService) { }

  getTheFormReset(): FormGroup {
    return this.theFormReset;
  }

  ngOnInit(): void {
    this.theFormReset = this.TheFormResetBuilder.group({
      email: ['', [Validators.required, Validators.maxLength(120), Validators.email]]});
  }

  ngOnDestroy() {
    this.onClear();
    if (this.theInscricao.length > 0) {
      this.theUnsubscribeControl.unsubscribe(this.theInscricao);
    }
    this.theFormReset = null;
    this.theInscricao = null;
  }

  onClear() {
    this.getTheFormReset().reset();   
  }

  onReset() {
    let formData: FormData = new FormData();
    formData.append('email', this.getTheFormReset().get('email').value);
    let dialogRef = this.dialog.open(ProgressSpinnerOverviewComponent, { disableClose: true, width: '350px', height: '350px' });
    this.theInscricao.push(this.theAutenticationService.onResetPassoword(formData)
      .subscribe((event: HttpEvent<Object>) => {
        if (event.type === HttpEventType.Response) {
          this.dialog.closeAll();
          let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
          let instance = dialogRef.componentInstance;
          instance.title = 'Status: ' + event.status;
          instance.subTitle = 'OK!...';
          instance.classCss = 'color-success';
          instance.message = event.statusText + '!! Uma nova senha foi enviada para seu email!';
          this.onClear();
          FormData = null;
          this.theAutenticationService.onReloadRoute('/login');
        } else if (event != null) {
          let instance = dialogRef.componentInstance;
          instance.title = 'Eviando uma nova senha!';
          instance.subTitle = 'Por Favor Aguarde...';
          instance.mode = 'indeterminate';
        }
      }, error => {

      }));
  }

}
