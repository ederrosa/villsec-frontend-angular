import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpEventType, HttpEvent } from '@angular/common/http';

import { Subscription } from 'rxjs';
import { EventoService } from '../evento.service';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { ProgressSpinnerOverviewComponent } from 'src/app/shared/components/progress-spinner/progress-spinner-overview/progress-spinner-overview.component';
import { InformativeAlertComponent } from 'src/app/shared/components/alerts/informative-alert/informative-alert.component';
import { IOptions } from 'src/app/shared/components/fields/select/select.component';
import { CepService } from 'src/app/core/services/cep.service';

@Component({
  selector: 'app-evento-insert',
  templateUrl: './evento-insert.component.html',
  styleUrls: ['./evento-insert.component.scss']
})
export class EventoInsertComponent implements OnInit {

  theForm: FormGroup;
  url: any;
  format: string;
  private theFile: File;
  private theInscricao: Subscription[] = new Array<Subscription>();
  optionsTipoEvento: IOptions[] = [
    { value: 1, option: 'tipo 1' },
    { value: 2, option: 'tipo 2' },
    { value: 3, option: 'tipo 3' },
    { value: 4, option: 'tipo 4' },
    { value: 5, option: 'tipo 5' },
    { value: 6, option: 'tipo 6' }];
 
  constructor(
    private theFormBuilder: FormBuilder,
    private theEventoService: EventoService,
    private dialog: MatDialog,
    private theCepService: CepService,
    private theUnsubscribeControl: UnsubscribeControlService
  ) { }

  consultaCEP() {
    const cep = this.theForm.get('cep').value;
    if (cep != null && cep !== '') {
      this.theInscricao.push(this.theCepService.consultaCEP(cep)
        .subscribe(dados => this.populaDadosForm(dados)));
    }
  }

  ngOnInit() {
    this.theForm = this.theFormBuilder.group({
      file: ['', [Validators.required]],
      classificacao: ['', [Validators.required]],
      duracao: ['', [Validators.required]],
      data: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      tipoEvento: ['', [Validators.required]],
      logradouro: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      bairro: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      pais: ['', [Validators.required]]   
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
    formData.append('classificacao', this.theForm.get('classificacao').value);
    formData.append('duracao', this.theForm.get('duracao').value);
    formData.append('data', new Date(this.theForm.get('data').value).toLocaleDateString());
    formData.append('descricao', this.theForm.get('descricao').value);
    formData.append('file', this.theFile, this.theFile.name);
    formData.append('tipoEvento', this.theForm.get('tipoEvento').value);
    formData.append('nome', this.theForm.get('nome').value);
    formData.append('logradouro', this.theForm.get('logradouro').value);
    formData.append('cep', this.theForm.get('cep').value);
    formData.append('bairro', this.theForm.get('bairro').value);
    formData.append('cidade', this.theForm.get('cidade').value);
    formData.append('estado', this.theForm.get('estado').value);
    formData.append('pais', this.theForm.get('pais').value);    
    let dialogRef = this.dialog.open(ProgressSpinnerOverviewComponent, { disableClose: true, width: '350px', height: '350px' });
    this.theInscricao.push(this.theEventoService.insert(formData)
      .subscribe((event: HttpEvent<Object>) => {
        if (event.type === HttpEventType.Response) {
          this.dialog.closeAll();
          let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
          let instance = dialogRef.componentInstance;
          instance.title = "Status: " + event.status;
          instance.subTitle = 'OK!...';
          instance.classCss = 'color-success';
          instance.message = event.statusText + '!! O novo Evento foi cadastrado com sucesso!';
          console.log(this.theForm);
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

  populaDadosForm(dados) {
    this.theForm.patchValue({
      logradouro: dados.logradouro,
      cep: dados.cep,
      complemento: dados.complemento,
      bairro: dados.bairro,
      cidade: dados.localidade,
      estado: dados.uf,
      pais: 'Brasil'
    });
  }
}
