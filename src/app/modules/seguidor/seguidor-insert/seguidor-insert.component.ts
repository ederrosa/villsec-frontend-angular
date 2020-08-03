import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpEventType, HttpEvent } from '@angular/common/http';

import { Subscription } from 'rxjs';
import { SeguidorService } from '../seguidor.service';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { ProgressSpinnerOverviewComponent } from 'src/app/shared/components/progress-spinner/progress-spinner-overview/progress-spinner-overview.component';
import { InformativeAlertComponent } from 'src/app/shared/components/alerts/informative-alert/informative-alert.component';
import { IOptions } from 'src/app/shared/components/fields/select/select.component';
import { CepService } from 'src/app/core/services/cep.service';
import { PatternService } from 'src/app/core/services/pattern.service';

@Component({
  selector: 'app-seguidor-insert',
  templateUrl: './seguidor-insert.component.html',
  styleUrls: ['./seguidor-insert.component.scss']
})
export class SeguidorInsertComponent implements OnInit {

  private format: string;
  private readonly optionsGenero: IOptions[] = [
    { value: 'Masculino', option: 'Masculino' },
    { value: 'Feminino', option: 'Feminino' }];
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
    private theSeguidorService: SeguidorService,    
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

  getOptionsTipoTelefone(): IOptions[] {
    return this.optionsTipoTelefone;
  }

  getTheFile(): File {
    return this.theFile;
  }

  public getTheForm(): FormGroup {
    return this.theForm;
  }

  getUrl() {
    return this.url;
  }

  ngOnDestroy() {
    this.onClear();
    if (this.theInscricao.length > 0) {
      this.theUnsubscribeControl.unsubscribe(this.theInscricao);
    }    
    this.theInscricao = null;
    this.theForm = null;
  }

  ngOnInit() {
    this.theForm = this.theFormBuilder.group({
      bairro: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      cidade: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      cep: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(8), Validators.pattern(this.thePatternService.getRegExpCep())]],
      dataNascimento: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.maxLength(120), Validators.email]],
      estado: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      file: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      logradouro: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(1)]],
      nome: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(4), Validators.pattern(this.thePatternService.getRegExpOnlyLetters())]],
      numeroTelefone1: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(10)]],
      pais: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      senha: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(6)]],
      tipoTelefone1: ['', [Validators.required]],
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
    formData.append('file', this.getTheFile(), this.getTheFile().name);
    formData.append('genero', this.getTheForm().get('genero').value);
    formData.append('logradouro', this.getTheForm().get('logradouro').value);
    formData.append('nome', this.getTheForm().get('nome').value);
    formData.append('numeroTelefone1', this.getTheForm().get('numeroTelefone1').value);
    formData.append('pais', this.getTheForm().get('pais').value);
    formData.append('senha', this.getTheForm().get('senha').value);
    formData.append('status', 'true');
    formData.append('tipoTelefone1', this.getTheForm().get('tipoTelefone1').value);
    let dialogRef = this.dialog.open(ProgressSpinnerOverviewComponent, { disableClose: true, width: '350px', height: '350px' });
    this.theInscricao.push(this.theSeguidorService.insert(formData)
      .subscribe((event: HttpEvent<Object>) => {
        if (event.type === HttpEventType.Response) {
          this.dialog.closeAll();
          let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
          let instance = dialogRef.componentInstance;
          instance.title = "Status: " + event.status;
          instance.subTitle = 'OK!...';
          instance.classCss = 'color-success';
          instance.message = event.statusText + '!! O novo Seguidor foi cadastrado com sucesso!';
          instance.urlNavigate = '/login';
          this.onClear();
          FormData = null;
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
