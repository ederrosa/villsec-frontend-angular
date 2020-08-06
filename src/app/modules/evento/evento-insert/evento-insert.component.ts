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
import { PatternService } from 'src/app/core/services/pattern.service';

@Component({
  selector: 'app-evento-insert',
  templateUrl: './evento-insert.component.html',
  styleUrls: ['./evento-insert.component.scss']
})
export class EventoInsertComponent implements OnInit, OnDestroy {

  private format: string;
  private readonly optionsTipoEvento: IOptions[] = [
    { value: 1, option: 'Adulto +18' },
    { value: 2, option: 'Infantil' },
    { value: 3, option: 'LGBTQ+' },
    { value: 4, option: 'Live' },
    { value: 5, option: 'Público' },
    { value: 6, option: 'Restrito à Convidados' },
    { value: 7, option: 'Terceira Idade' },
    { value: 8, option: 'VIP' }];
  private theFile: File;
  private theForm: FormGroup;
  private theInscricao: Subscription[] = new Array<Subscription>();
  private url: any;

  constructor(
    private dialog: MatDialog,
    private theCepService: CepService,
    private theEventoService: EventoService,   
    private theFormBuilder: FormBuilder,
    private thePatternService: PatternService,
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
    console.log('aqui');
    const cep = this.getTheForm().get('cep').value;
    if (cep != null && cep !== '') {
      this.theInscricao.push(this.theCepService.consultaCEP(cep)
        .subscribe(dados => this.populaDadosForm(dados)));
    }
  }

  ngOnDestroy() {
    this.onClear();
    if (this.theInscricao.length > 0) {
      this.theUnsubscribeControl.unsubscribe(this.theInscricao);
    }
    this.theForm = null;
    this.theInscricao = null
  }

  ngOnInit() {
    this.theForm = this.theFormBuilder.group({
      file: ['', [Validators.required]],
      classificacao: ['', [Validators.required]],
      diaInicio: ['', [Validators.required]],
      diaTermino: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      googleMapsUrl: [''],
      horaInicio: ['', [Validators.required]],
      horaTermino: ['', [Validators.required]],
      ingressoUrl: ['', Validators.pattern(this.thePatternService.getRegExpUrl())],
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
    formData.append('bairro', this.getTheForm().get('bairro').value);
    formData.append('cep', this.getTheForm().get('cep').value);
    formData.append('cidade', this.getTheForm().get('cidade').value);
    formData.append('classificacao', this.getTheForm().get('classificacao').value);
    formData.append('descricao', this.getTheForm().get('descricao').value);
    formData.append('diaInicio', new Date(this.getTheForm().get('diaInicio').value).toLocaleDateString());
    formData.append('diaTermino', new Date(this.getTheForm().get('diaTermino').value).toLocaleDateString());
    formData.append('estado', this.getTheForm().get('estado').value);
    formData.append('file', this.getTheFile(), this.getTheFile().name);
    if (this.getTheForm().get('googleMapsUrl').value != null && this.getTheForm().get('googleMapsUrl').value != '') {
      formData.append('googleMapsUrl', this.getTheForm().get('googleMapsUrl').value);
    } 
    formData.append('horaInicio', this.getTheForm().get('horaInicio').value);
    formData.append('horaTermino', this.getTheForm().get('horaTermino').value);
    formData.append('ingressoUrl', this.getTheForm().get('ingressoUrl').value);
    formData.append('logradouro', this.getTheForm().get('logradouro').value);
    formData.append('nome', this.getTheForm().get('nome').value);
    formData.append('pais', this.getTheForm().get('pais').value);
    formData.append('tipoEvento', this.getTheForm().get('tipoEvento').value);
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
          formData = null;
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
      bairro: dados.bairro,
      cidade: dados.localidade,
      estado: dados.uf,
      pais: 'Brasil'
    });
  }
}
