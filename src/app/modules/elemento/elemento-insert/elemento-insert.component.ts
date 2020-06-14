import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpEventType, HttpEvent } from '@angular/common/http';

import { Subscription } from 'rxjs';
import { ElementoService } from '../elemento.service';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { ProgressSpinnerOverviewComponent } from 'src/app/shared/components/progress-spinner/progress-spinner-overview/progress-spinner-overview.component';
import { InformativeAlertComponent } from 'src/app/shared/components/alerts/informative-alert/informative-alert.component';
import { IOptions } from 'src/app/shared/components/fields/select/select.component';

@Component({
  selector: 'app-elemento-insert',
  templateUrl: './elemento-insert.component.html',
  styleUrls: ['./elemento-insert.component.scss']
})
export class ElementoInsertComponent implements OnInit {

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
    private theElementoService: ElementoService,
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
      file: [''],
      descricao: ['', [Validators.required]],
      embed: [''],
      tipoElemento: ['', [Validators.required]],
      titulo: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  onClear() {
    this.theForm.reset();
    this.url = null;
    this.format = null;
    this.theFile = null;
  }

  onSave() {
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
    let dialogRef = this.dialog.open(ProgressSpinnerOverviewComponent, { disableClose: true, width: '350px', height: '350px' });
    this.theInscricao.push(this.theElementoService.insert(formData)
      .subscribe((event: HttpEvent<Object>) => {
        if (event.type === HttpEventType.Response) {
          this.dialog.closeAll();
          let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
          let instance = dialogRef.componentInstance;
          instance.title = "Status: " + event.status;
          instance.subTitle = 'OK!...';
          instance.classCss = 'color-success';
          instance.message = event.statusText + '!! O novo Arquivo foi armazenado com sucesso!';
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

  onSelectFile(event) {
    this.theFile = event.target.files && event.target.files[0];
    if (this.getTheFile()) {
      var reader = new FileReader();
      reader.readAsDataURL(this.getTheFile());
      if (this.theFile.type.indexOf('image') > -1) {
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
