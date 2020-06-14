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

  private format: string;
  private readonly optionsTipoElemento: IOptions[] = [
    { value: 1, option: 'Imagem' },
    { value: 2, option: 'Vídeo' },
    { value: 3, option: 'LiveStream' },
    { value: 4, option: 'Show' },
    { value: 5, option: 'Áudio' }];
  private readonly optionsStatus: IOptions[] = [
    { value: true, option: 'Ativo' },
    { value: false, option: 'Inativo' }];
  private theFile: File;
  private theForm: FormGroup;
  private theInscricao: Subscription[] = new Array<Subscription>();
  private url: any;

  constructor(
    private dialog: MatDialog,
    private theActivatedRoute: ActivatedRoute,
    private theElementoService: ElementoService,    
    private theFieldsService: FieldsService,
    private theFormBuilder: FormBuilder,    
    private theUnsubscribeControl: UnsubscribeControlService
  ) { }

  getFormat(): string {
    return this.format;
  }

  getOptionsTipoElemento(): IOptions[] {
    return this.optionsTipoElemento;
  }

  getOptionsStatus(): IOptions[] {
    return this.optionsStatus;
  }

  getTheFile(): File {
    return this.theFile;
  }

  getTheForm(): FormGroup {
    return this.theForm;
  }

  getUrl() {
    return this.url;
  }

  ngOnDestroy() {
    this.onClear();
    this.theUnsubscribeControl.unsubscribe(this.theInscricao);
  }

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
    if (this.theElementoService.getIElementoDTO() == null) {
      this.theActivatedRoute.params.pipe(
        map((params: any) => params['id']),
        switchMap(id => this.theElementoService.find(id))
      ).subscribe(theIElementoDTO => this.onFormUpdate(theIElementoDTO));
    } else {
      this.onFormUpdate(this.theElementoService.getIElementoDTO());
    }
  }

  onClear() {
    this.theForm.reset();
    this.url = null;
    this.format = null;
    this.theFile = null;
  }

  onFormUpdate(theIElementoDTO: IElementoDTO): void {
    if (theIElementoDTO.elementoUrl != null && theIElementoDTO.elementoUrl != '') {
      this.url = theIElementoDTO.elementoUrl;
    } else if (theIElementoDTO.embed != null && theIElementoDTO.embed != '') {
      this.url = theIElementoDTO.embed;
    }   
    this.theForm.patchValue({
      id: theIElementoDTO.id,
      dtCriacao: theIElementoDTO.dtCriacao,
      file: '',
      titulo: theIElementoDTO.titulo,
      descricao: theIElementoDTO.descricao,
      embed: theIElementoDTO.embed,
      tipoElemento: this.theFieldsService.getItemOfSelect(this.getOptionsTipoElemento(), theIElementoDTO.tipoElemento),
      status: this.theFieldsService.getItemOfSelect(this.getOptionsStatus(), theIElementoDTO.status),
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
        if (this.getTheFile()) {
          formData.append('file', this.getTheFile(), this.getTheFile().name);
        } else if (this.getTheForm().get('embed').valid) {
          formData.append('embed', this.getTheForm().get('embed').value);
        }
        formData.append('descricao', this.getTheForm().get('descricao').value);
        formData.append('tipoElemento', this.getTheForm().get('tipoElemento').value);
        formData.append('titulo', this.getTheForm().get('titulo').value);
        formData.append('status', this.getTheForm().get('status').value);
        this.theInscricao.push(this.theElementoService.update(formData, this.getTheForm().get('id').value)
          .subscribe((event: HttpEvent<Object>) => {
            if (event.type === HttpEventType.Response) {
              this.dialog.closeAll();
              let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
              let instance = dialogRef.componentInstance;
              instance.title = "Status: " + event.status;
              instance.subTitle = 'Alterado!...';
              instance.classCss = 'color-success';
              instance.message = event.statusText + '!! O Elemento foi alterado com sucesso!';
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

  onSelectFile(event) {
    this.theFile = event.target.files && event.target.files[0];
    if (this.getTheFile()) {
      var reader = new FileReader();
      reader.readAsDataURL(this.getTheFile());
      if (this.getTheFile().type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (this.getTheFile().type.indexOf('video') > -1) {
        this.format = 'video';
      } else if (this.getTheFile().type.indexOf('audio') > -1) {
        this.format = 'audio';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      }
    }
  }

  setUrl() {
    this.url = this.getTheForm().get('embed').value;
  }
}
