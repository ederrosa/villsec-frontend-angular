import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpEventType, HttpEvent } from '@angular/common/http';

import { Subscription } from 'rxjs';
import { ProprietarioService } from '../proprietario.service';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { ProgressSpinnerOverviewComponent } from 'src/app/shared/components/progress-spinner/progress-spinner-overview/progress-spinner-overview.component';
import { InformativeAlertComponent } from 'src/app/shared/components/alerts/informative-alert/informative-alert.component';
import { IOptions } from 'src/app/shared/components/fields/select/select.component';
import { CepService } from 'src/app/core/services/cep.service';
import { PatternService } from 'src/app/core/services/pattern.service';

@Component({
  selector: 'app-proprietario-insert',
  templateUrl: './proprietario-insert.component.html',
  styleUrls: ['./proprietario-insert.component.scss']
})
export class ProprietarioInsertComponent implements OnInit, OnDestroy {

  private format: string;
  private readonly optionsGenero: IOptions[] = [
    { value: 'Masculino', option: 'Masculino' },
    { value: 'Feminino', option: 'Feminino' }];
  private readonly optionsStatus: IOptions[] = [
    { value: true, option: 'Ativo' },
    { value: false, option: 'Inativo' }];
  private readonly optionsTipoTelefone: IOptions[] = [
    { value: 1, option: 'Celular' },
    { value: 2, option: 'Corporativo' },
    { value: 3, option: 'Recado' },
    { value: 4, option: 'Residêncial' },
    { value: 5, option: 'SAC' },
    { value: 6, option: 'Whatsapp' }];
  private theFile: File;
  private theForm: FormGroup;
  private theInscricao: Subscription[] = new Array<Subscription>();
  private url: any;

  constructor(
    private dialog: MatDialog,
    private theCepService: CepService,
    private theFormBuilder: FormBuilder,
    private thePatternService: PatternService,
    private theProprietarioService: ProprietarioService,
    private theUnsubscribeControl: UnsubscribeControlService
  ) { }

  consultaCEP() {
    const cep = this.getTheForm().get('cep').value;
    if (cep != null && cep !== '') {
      this.theInscricao.push(this.theCepService.consultaCEP(cep)
        .subscribe(dados => this.onPopulaDadosForm(dados)));
    }
  }

  getFormat(): string {
    return this.format;
  }

  getOptionsGenero(): IOptions[] {
    return this.optionsGenero;
  }

  getOptionsStatus(): IOptions[] {
    return this.optionsStatus;
  }

  getOptionsTipoTelefone(): IOptions[] {
    return this.optionsTipoTelefone;
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
      bairro: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      cidade: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      cep: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(8)]],
      dataNascimento: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.maxLength(120), Validators.email]],
      estado: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      facebook: ['', Validators.pattern(this.thePatternService.getRegexUrl())],
      file: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      googleMapsUrl:[''],
      instagram: ['', Validators.pattern(this.thePatternService.getRegexUrl())],
      logradouro: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(1)]],
      nome: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(4)]],
      numeroTelefone1: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(4)]],
      numeroTelefone2: [''],
      pais: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      senha: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(6)]],
      sobreMim: [''],
      spotify: ['', Validators.pattern(this.thePatternService.getRegexUrl())],
      status: ['', [Validators.required]],
      tipoTelefone1: ['', [Validators.required]],
      tipoTelefone2: [''],
      twitter: ['', Validators.pattern(this.thePatternService.getRegexUrl())],
      twitch: ['', Validators.pattern(this.thePatternService.getRegexUrl())],
      youtube: ['', Validators.pattern(this.thePatternService.getRegexUrl())],
    });
  }

  onClear() {
    this.getTheForm().reset();
    this.url = null;
    this.format = null;
    this.theFile = null;
  }

  onPopulaDadosForm(dados) {
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

  onSave() {
    let formData: FormData = new FormData();
    formData.append('bairro', this.getTheForm().get('bairro').value);
    formData.append('cidade', this.getTheForm().get('cidade').value);
    formData.append('cep', this.getTheForm().get('cep').value);
    formData.append('dataNascimento', new Date(this.getTheForm().get('dataNascimento').value).toLocaleDateString());
    formData.append('email', this.getTheForm().get('email').value);
    formData.append('estado', this.getTheForm().get('estado').value);
    formData.append('facebook', this.getTheForm().get('facebook').value);
    formData.append('file', this.getTheFile(), this.getTheFile().name);
    formData.append('genero', this.getTheForm().get('genero').value);
    if (this.getTheForm().get('googleMapsUrl').value != null && this.getTheForm().get('googleMapsUrl').value != '') {
      formData.append('googleMapsUrl', this.getTheForm().get('googleMapsUrl').value);
    }    
    formData.append('instagram', this.getTheForm().get('instagram').value);
    formData.append('logradouro', this.getTheForm().get('logradouro').value);
    formData.append('nome', this.getTheForm().get('nome').value);
    formData.append('numeroTelefone1', this.getTheForm().get('numeroTelefone1').value);
    if (this.getTheForm().get('tipoTelefone2').value != '' && this.getTheForm().get('tipoTelefone2').value != null) {
      formData.append('numeroTelefone2', this.getTheForm().get('numeroTelefone2').value);
      formData.append('tipoTelefone2', this.getTheForm().get('tipoTelefone2').value);
    }
    formData.append('pais', this.getTheForm().get('pais').value);
    formData.append('senha', this.getTheForm().get('senha').value);
    formData.append('sobreMim', this.getTheForm().get('sobreMim').value);
    formData.append('spotify', this.getTheForm().get('spotify').value);
    formData.append('status', this.getTheForm().get('status').value);
    formData.append('tipoTelefone1', this.getTheForm().get('tipoTelefone1').value);
    formData.append('twitter', this.getTheForm().get('twitter').value);
    formData.append('twitch', this.getTheForm().get('twitch').value);
    formData.append('youtube', this.getTheForm().get('youtube').value);
    
    let dialogRef = this.dialog.open(ProgressSpinnerOverviewComponent, { disableClose: true, width: '350px', height: '350px' });
    this.theInscricao.push(this.theProprietarioService.insert(formData)
      .subscribe((event: HttpEvent<Object>) => {
        if (event.type === HttpEventType.Response) {
          this.dialog.closeAll();
          let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
          let instance = dialogRef.componentInstance;
          instance.title = "Status: " + event.status;
          instance.subTitle = 'OK!...';
          instance.classCss = 'color-success';
          instance.message = event.statusText + '!! O novo Proprietario foi cadastrado com sucesso!';
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
