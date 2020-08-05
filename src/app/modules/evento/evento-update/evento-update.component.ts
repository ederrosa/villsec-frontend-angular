import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpEventType, HttpEvent } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { EventoService } from '../evento.service';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { ProgressSpinnerOverviewComponent } from 'src/app/shared/components/progress-spinner/progress-spinner-overview/progress-spinner-overview.component';
import { InformativeAlertComponent } from 'src/app/shared/components/alerts/informative-alert/informative-alert.component';
import { ConfirmationAlertComponent } from 'src/app/shared/components/alerts/confirmation-alert/confirmation-alert.component';
import { FieldsService } from 'src/app/shared/components/fields/fields.service';
import { switchMap, map } from 'rxjs/operators';
import { IEventoDTO } from 'src/app/shared/models/dtos/ievento-dto';
import { IOptions } from 'src/app/shared/components/fields/select/select.component';
import { CepService } from 'src/app/core/services/cep.service';
import { PatternService } from 'src/app/core/services/pattern.service';

@Component({
  selector: 'app-evento-update',
  templateUrl: './evento-update.component.html',
  styleUrls: ['./evento-update.component.scss']
})
export class EventoUpdateComponent implements OnInit, OnDestroy {

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
    private theActivatedRoute: ActivatedRoute,
    private theCepService: CepService,
    private theEventoService: EventoService,
    private theFieldsService: FieldsService,
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

  getUrl(): string {
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
      id: [{ value: '', disabled: true }],
      dtCriacao: [{ value: '', disabled: true }],
      file: [''],
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
      cep: ['', [Validators.required, Validators.pattern(this.thePatternService.getRegExpCep())]],
      bairro: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      pais: ['', [Validators.required]]
    });
    if (this.theEventoService.getIEventoDTO() == null) {
      this.theActivatedRoute.params.pipe(
        map((params: any) => params['id']),
        switchMap(id => this.theEventoService.find(id))
      ).subscribe(theIEventoDTO => this.onFormUpdate(theIEventoDTO));
    } else {
      this.onFormUpdate(this.theEventoService.getIEventoDTO());
    }
  }

  onFormUpdate(theIEventoDTO: IEventoDTO): void {
    this.format = 'image';
    this.url = theIEventoDTO.folderUrl;
    this.getTheForm().patchValue({
      id: theIEventoDTO.id,
      dtCriacao: theIEventoDTO.dtCriacao,
      file: '',
      classificacao: theIEventoDTO.classificacao,
      diaInicio: new Date(theIEventoDTO.diaInicio.toString()),
      diaTermino: new Date(theIEventoDTO.diaTermino.toString()),
      descricao: theIEventoDTO.descricao,
      googleMapsUrl: theIEventoDTO.googleMapsUrl,
      horaInicio: theIEventoDTO.horaInicio.toString(),
      horaTermino: theIEventoDTO.horaTermino.toString(),
      ingressoUrl: theIEventoDTO.ingressoUrl,
      nome: theIEventoDTO.nome,
      tipoEvento: this.theFieldsService.getItemOfSelect(this.getOptionsTipoEvento(), theIEventoDTO.tipoEvento),
      logradouro: theIEventoDTO.logradouro,
      cep: theIEventoDTO.cep,
      bairro: theIEventoDTO.bairro,
      cidade: theIEventoDTO.cidade,
      estado: theIEventoDTO.estado,
      pais: theIEventoDTO.pais
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
        formData.append('bairro', this.getTheForm().get('bairro').value);
        formData.append('cep', this.getTheForm().get('cep').value);
        formData.append('cidade', this.getTheForm().get('cidade').value);
        formData.append('classificacao', this.getTheForm().get('classificacao').value);
        formData.append('descricao', this.getTheForm().get('descricao').value);
        formData.append('diaInicio', new Date(this.getTheForm().get('diaInicio').value).toLocaleDateString());
        formData.append('diaTermino', new Date(this.getTheForm().get('diaTermino').value).toLocaleDateString());
        formData.append('estado', this.getTheForm().get('estado').value);
        if (this.getTheFile()) {
          formData.append('file', this.getTheFile(), this.getTheFile().name);
        }
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
        this.theInscricao.push(this.theEventoService.update(formData, this.getTheForm().get('id').value)
          .subscribe((event: HttpEvent<Object>) => {
            if (event.type === HttpEventType.Response) {
              this.dialog.closeAll();
              let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
              let instance = dialogRef.componentInstance;
              instance.title = "Status: " + event.status;
              instance.subTitle = 'Alterado!...';
              instance.classCss = 'color-success';
              instance.message = event.statusText + '!! O Evento foi alterado com sucesso!';
              instance.urlNavigate = '/eventos';
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
