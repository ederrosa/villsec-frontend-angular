import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpEventType, HttpEvent } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { ElementoService } from '../elemento.service';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { ProgressSpinnerOverviewComponent } from 'src/app/shared/components/progress-spinner/progress-spinner-overview/progress-spinner-overview.component';
import { InformativeAlertComponent } from 'src/app/shared/components/alerts/informative-alert/informative-alert.component';
import { ConfirmationAlertComponent } from 'src/app/shared/components/alerts/confirmation-alert/confirmation-alert.component';
import { FieldsService } from 'src/app/shared/components/fields/fields.service';
import { switchMap, map } from 'rxjs/operators';
import { IElementoDTO } from 'src/app/shared/models/dtos/ielemento-dto';
import { IOptions } from 'src/app/shared/components/fields/select/select.component';

@Component({
  selector: 'app-elemento-update',
  templateUrl: './elemento-update.component.html',
  styleUrls: ['./elemento-update.component.scss']
})
export class ElementoUpdateComponent implements OnInit {

  theForm: FormGroup;
  url: any;
  format: string;
  private theFile: File;
  private theInscricao: Subscription[] = new Array<Subscription>();
  optionsTipoElemento: IOptions[] = [
    { value: 1, option: 'Imagem' },
    { value: 2, option: 'Vídeo' },
    { value: 3, option: 'LiveStream' },
    { value: 4, option: 'Show' },
    { value: 5, option: 'Áudio' }];
  optionsStatus: IOptions[] = [
    { value: true, option: 'Ativo' },
    { value: false, option: 'Inativo' }];

  constructor(
    private theElementoService: ElementoService,
    private theActivatedRoute: ActivatedRoute,
    private theFieldsService: FieldsService,
    private theFormBuilder: FormBuilder,
    private dialog: MatDialog,
    private theUnsubscribeControl: UnsubscribeControlService
  ) { }

  ngOnInit() {
    this.theForm = this.theFormBuilder.group({
      id: [''],
      dtCriacao: [''],
      file: [''],
      descricao: ['', [Validators.required]],
      embed: [''],
      tipoElemento: ['', [Validators.required]],
      titulo: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
    if (this.theElementoService.theElemento == null) {
      this.theActivatedRoute.params.pipe(
        map((params: any) => params['id']),
        switchMap(id => this.theElementoService.find(id))
      ).subscribe(theElemento => this.onFormUpdate(theElemento));
    } else {
      this.onFormUpdate(this.theElementoService.theElemento);
    }
  }

  ngOnDestroy() {
    this.onClear();
    this.theUnsubscribeControl.unsubscribe(this.theInscricao);
  }

  onFormUpdate(theElemento: IElementoDTO): void {
    if (theElemento.elementoUrl != null && theElemento.elementoUrl != '') {
      this.url = theElemento.elementoUrl;
    } else if (theElemento.embed != null && theElemento.embed != '') {
      this.url = theElemento.embed;
    }
   
    this.theForm.patchValue({
      id: theElemento.id,
      dtCriacao: theElemento.dtCriacao,
      file: '',
      titulo: theElemento.titulo,
      descricao: theElemento.descricao,
      embed: theElemento.embed,
      tipoElemento: this.theFieldsService.getItemOfSelect(this.optionsTipoElemento, theElemento.tipoElemento),
      status: this.theFieldsService.getItemOfSelect(this.optionsStatus, theElemento.status),
    });
  }

  onSelectFile(event) {
    this.theFile = event.target.files && event.target.files[0];
    if (this.theFile) {
      var reader = new FileReader();
      reader.readAsDataURL(this.theFile);
      if (this.theFile.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (this.theFile.type.indexOf('video') > -1) {
        this.format = 'video';
      } else if (this.theFile.type.indexOf('audio') > -1) {
        this.format = 'audio';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      }
    }
  }

  onClear() {
    this.theForm.reset();
    this.url = null;
    this.format = null;
    this.theFile = null;
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
        if (this.theFile) {
          formData.append('file', this.theFile, this.theFile.name);
        } else if (this.theForm.get('embed').valid) {
          formData.append('embed', this.theForm.get('embed').value);
        }
        formData.append('descricao', this.theForm.get('descricao').value);
        formData.append('tipoElemento', this.theForm.get('tipoElemento').value);
        formData.append('titulo', this.theForm.get('titulo').value);
        formData.append('status', this.theForm.get('status').value);
        if (this.theFile) {
          formData.append('file', this.theFile, this.theFile.name);
        }
        this.theInscricao.push(this.theElementoService.update(formData, this.theForm.get('id').value)
          .subscribe((event: HttpEvent<Object>) => {
            if (event.type === HttpEventType.Response) {
              this.dialog.closeAll();
              let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
              let instance = dialogRef.componentInstance;
              instance.title = "Status: " + event.status;
              instance.subTitle = 'Alterado!...';
              instance.classCss = 'color-success';
              instance.message = event.statusText + '!! O Elemento foi alterada com sucesso!';
              instance.urlNavigate = '/elementos';
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

  setUrl() {
    this.url = this.theForm.get('embed').value;
  }
}
