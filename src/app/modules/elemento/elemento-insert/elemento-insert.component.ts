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
    private theFormBuilder: FormBuilder,
    private theElementoService: ElementoService,
    private dialog: MatDialog,
    private theUnsubscribeControl: UnsubscribeControlService
  ) { }

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

  ngOnDestroy() {
    this.onClear();
    this.theUnsubscribeControl.unsubscribe(this.theInscricao);    
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

  setUrl() {
    this.url = this.theForm.get('embed').value;
  }
}
