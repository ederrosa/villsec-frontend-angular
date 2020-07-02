import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class EventoInsertComponent implements OnInit, OnDestroy{

  private format: string;
  private readonly optionsTipoEvento: IOptions[] = [
    { value: 1, option: 'tipo 1' },
    { value: 2, option: 'tipo 2' },
    { value: 3, option: 'tipo 3' },
    { value: 4, option: 'tipo 4' },
    { value: 5, option: 'tipo 5' },
    { value: 6, option: 'tipo 6' }];
  private theFile: File;
  private theForm: FormGroup;
  private theInscricao: Subscription[] = new Array<Subscription>();
  private url: any;

  constructor(    
    private dialog: MatDialog,
    private theCepService: CepService,
    private theEventoService: EventoService,
    private theFormBuilder: FormBuilder,
    private theUnsubscribeControl: UnsubscribeControlService
  ) { }

  getFormat(): string {
    return this.format;
  }

  getOptionsTipoEvento(): IOptions[] {
    return this.optionsTipoEvento;
  }

  getTheFile(): File {
    return this.theFile;
  }

  getTheForm(): FormGroup {
    return this.theForm;
  }

  getUrl(): any {
    return this.url;
  }

  onClear() {
    this.getTheForm().reset();
    this.url = null;
    this.format = null;
    this.theFile = null;
  }

  onConsultaCEP() {
    const cep = this.getTheForm().get('cep').value;
    if (cep != null && cep !== '') {
      this.theInscricao.push(this.theCepService.consultaCEP(cep)
        .subscribe(dados => this.populaDadosForm(dados)));
    }
  }

  ngOnDestroy() {
    this.onClear();
    this.theUnsubscribeControl.unsubscribe(this.theInscricao);
  }

  ngOnInit() {
    this.theForm = this.theFormBuilder.group({
      file: ['', [Validators.required]],
      classificacao: ['', [Validators.required]],
      diaInicio: ['', [Validators.required]],
      diaTermino: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      horaInicio: ['', [Validators.required]],
      horaTermino: ['', [Validators.required]],
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

  onSave() {
    let formData: FormData = new FormData();
    formData.append('classificacao', this.getTheForm().get('classificacao').value);
    formData.append('diaInicio', new Date(this.getTheForm().get('diaInicio').value).toLocaleDateString());
    formData.append('diaTermino', new Date(this.getTheForm().get('diaTermino').value).toLocaleDateString());
    formData.append('descricao', this.getTheForm().get('descricao').value);
    if (this.getTheFile()) {
      formData.append('file', this.getTheFile(), this.getTheFile().name);
    }
    formData.append('horaInicio', this.getTheForm().get('horaInicio').value);
    formData.append('horaTerminio', this.getTheForm().get('horaTermino').value);
    formData.append('tipoEvento', this.getTheForm().get('tipoEvento').value);
    formData.append('nome', this.getTheForm().get('nome').value);
    formData.append('logradouro', this.getTheForm().get('logradouro').value);
    formData.append('cep', this.getTheForm().get('cep').value);
    formData.append('bairro', this.getTheForm().get('bairro').value);
    formData.append('cidade', this.getTheForm().get('cidade').value);
    formData.append('estado', this.getTheForm().get('estado').value);
    formData.append('pais', this.getTheForm().get('pais').value);
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
      if (this.getTheFile().type.indexOf('image') > -1) {
        this.format = 'image';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      }
    }
  }

  private populaDadosForm(dados) {
    this.getTheForm().patchValue({
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
