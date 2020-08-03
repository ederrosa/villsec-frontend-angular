import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpEventType, HttpEvent } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { GaleriaService } from '../galeria.service';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { ProgressSpinnerOverviewComponent } from 'src/app/shared/components/progress-spinner/progress-spinner-overview/progress-spinner-overview.component';
import { InformativeAlertComponent } from 'src/app/shared/components/alerts/informative-alert/informative-alert.component';
import { ConfirmationAlertComponent } from 'src/app/shared/components/alerts/confirmation-alert/confirmation-alert.component';
import { switchMap, map } from 'rxjs/operators';
import { IGaleriaDTO } from 'src/app/shared/models/dtos/igaleria-dto';
import { IOptions } from 'src/app/shared/components/fields/select/select.component';
import { FieldsService } from 'src/app/shared/components/fields/fields.service';

@Component({
  selector: 'app-galeria-update',
  templateUrl: './galeria-update.component.html',
  styleUrls: ['./galeria-update.component.scss']
})
export class GaleriaUpdateComponent implements OnInit {

  private theForm: FormGroup;
  private theInscricao: Subscription[] = new Array<Subscription>();
  private readonly optionsStatus: IOptions[] = [
    { value: true, option: 'Ativo' },
    { value: false, option: 'Inativo' }];

  constructor(
    private dialog: MatDialog,
    private theActivatedRoute: ActivatedRoute,
    private theFieldsService: FieldsService,
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
    if (this.theInscricao.length > 0) {
      this.theUnsubscribeControl.unsubscribe(this.theInscricao);
    }
    this.theForm = null;
    this.theInscricao = null;
  }

  onClear() {
    this.getTheForm().reset();
  }

  ngOnInit() {
    this.theForm = this.theFormBuilder.group({
      id: [{ value: '', disabled: true }],
      dtCriacao: [{ value: '', disabled: true }],
      descricao: ['', [Validators.required]],
      status: ['', [Validators.required]],
      titulo: ['', [Validators.required]]
    });
    if (this.theGaleriaService.getIGaleriaDTO() == null) {
      this.theActivatedRoute.params.pipe(
        map((params: any) => params['id']),
        switchMap(id => this.theGaleriaService.find(id))
      ).subscribe(theIGaleriaDTO => this.onFormUpdate(theIGaleriaDTO));
    } else {
      this.onFormUpdate(this.theGaleriaService.getIGaleriaDTO());
    }
  }

  onFormUpdate(theIGaleriaDTO: IGaleriaDTO): void {
    this.getTheForm().patchValue({
      id: theIGaleriaDTO.id,
      dtCriacao: theIGaleriaDTO.dtCriacao,
      descricao: theIGaleriaDTO.descricao,
      status: this.theFieldsService.getItemOfSelect(this.optionsStatus, theIGaleriaDTO.status),
      titulo: theIGaleriaDTO.titulo,
    });
  }

  onSave() {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(ConfirmationAlertComponent, { disableClose: true, width: '40%' });
    let instance = dialogRef.componentInstance;
    instance.title = 'Você deseja proceguir com a alteração?';
    instance.subTitle = 'Confirma a alteração';
    instance.classCss = 'color-danger';
    this.theInscricao.push(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let formData: FormData = new FormData();
        formData.append('descricao', this.getTheForm().get('descricao').value);
        formData.append('status', this.getTheForm().get('status').value);
        formData.append('titulo', this.getTheForm().get('titulo').value);
        this.theInscricao.push(this.theGaleriaService.update(formData, this.getTheForm().get('id').value)
          .subscribe((event: HttpEvent<Object>) => {
            if (event.type === HttpEventType.Response) {
              this.dialog.closeAll();
              let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
              let instance = dialogRef.componentInstance;
              instance.title = "Status: " + event.status;
              instance.subTitle = 'Alterado!...';
              instance.classCss = 'color-success';
              instance.message = event.statusText + '!! A Galeria foi alterada com sucesso!';
              instance.urlNavigate = '/galerias';
              formData = null;
            } else if (event.type === HttpEventType.UploadProgress) {
              this.dialog.closeAll();
              let dialogRef = this.dialog.open(ProgressSpinnerOverviewComponent, { disableClose: true, width: '350px', height: '350px' });
              let instance = dialogRef.componentInstance;
              instance.title = 'Alterando registro!';
              instance.subTitle = 'Por Favor Aguarde...';
              instance.mode = 'indeterminate';
            }
          }, error => {

          }));
      }
    }));
  }
}
