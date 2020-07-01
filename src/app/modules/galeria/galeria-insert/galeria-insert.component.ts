import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpEventType, HttpEvent } from '@angular/common/http';

import { Subscription } from 'rxjs';
import { GaleriaService } from '../galeria.service';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { ProgressSpinnerOverviewComponent } from 'src/app/shared/components/progress-spinner/progress-spinner-overview/progress-spinner-overview.component';
import { InformativeAlertComponent } from 'src/app/shared/components/alerts/informative-alert/informative-alert.component';
import { IOptions } from 'src/app/shared/components/fields/select/select.component';

@Component({
  selector: 'app-galeria-insert',
  templateUrl: './galeria-insert.component.html',
  styleUrls: ['./galeria-insert.component.scss']
})
export class GaleriaInsertComponent implements OnInit {
    
  private theForm: FormGroup;
  private theInscricao: Subscription[] = new Array<Subscription>();
  private readonly optionsStatus: IOptions[] = [
    { value: true, option: 'Ativo' },
    { value: false, option: 'Inativo' }];

  constructor(
    private dialog: MatDialog,
    private theFormBuilder: FormBuilder,
    private theGaleriaService: GaleriaService,
    private theUnsubscribeControl: UnsubscribeControlService
  ) { }

  getOptionsStatus(): IOptions[] {
    return this.optionsStatus;
  }

  getTheForm(): FormGroup {
    return this.theForm;
  }

  ngOnDestroy() {
    this.onClear();
    this.theUnsubscribeControl.unsubscribe(this.theInscricao);
  }

  ngOnInit() {
    this.theForm = this.theFormBuilder.group({
      descricao: ['', [Validators.required]],
      status: ['', [Validators.required]],
      titulo: ['', [Validators.required]]
    });
  }

  onClear() {
    this.getTheForm().reset();
  
  }

  onSave() {
    let formData: FormData = new FormData();
    formData.append('descricao', this.getTheForm().get('descricao').value);
    formData.append('status', this.getTheForm().get('status').value);
    formData.append('titulo', this.getTheForm().get('titulo').value);
    let dialogRef = this.dialog.open(ProgressSpinnerOverviewComponent, { disableClose: true, width: '350px', height: '350px' });
    this.theInscricao.push(this.theGaleriaService.insert(formData)
      .subscribe((event: HttpEvent<Object>) => {
        if (event.type === HttpEventType.Response) {
          this.dialog.closeAll();
          let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
          let instance = dialogRef.componentInstance;
          instance.title = "Status: " + event.status;
          instance.subTitle = 'OK!...';
          instance.classCss = 'color-success';
          instance.message = event.statusText + '!! A nova Galeria foi cadastrada com sucesso!';
          this.onClear();
        } else if (event.type === HttpEventType.UploadProgress) {
          let instance = dialogRef.componentInstance;
          instance.title = 'Salvando o novo registro!';
          instance.subTitle = 'Por Favor Aguarde...';
          instance.mode = 'indeterminate';
        }
      }, error => {

      }));
  }  
}
