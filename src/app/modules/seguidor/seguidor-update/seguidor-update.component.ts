import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpEventType, HttpEvent } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { SeguidorService } from '../seguidor.service';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { ProgressSpinnerOverviewComponent } from 'src/app/shared/components/progress-spinner/progress-spinner-overview/progress-spinner-overview.component';
import { InformativeAlertComponent } from 'src/app/shared/components/alerts/informative-alert/informative-alert.component';
import { ConfirmationAlertComponent } from 'src/app/shared/components/alerts/confirmation-alert/confirmation-alert.component';
import { FieldsService } from 'src/app/shared/components/fields/fields.service';
import { switchMap, map } from 'rxjs/operators';
import { ISeguidorDTO } from 'src/app/shared/models/dtos/iseguidor-dto';
import { IOptions } from 'src/app/shared/components/fields/select/select.component';
import { CepService } from 'src/app/core/services/cep.service';
import { PatternService } from 'src/app/core/services/pattern.service';

@Component({
  selector: 'app-seguidor-update',
  templateUrl: './seguidor-update.component.html',
  styleUrls: ['./seguidor-update.component.scss']
})
export class SeguidorUpdateComponent implements OnInit, OnDestroy {

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
    private theActivatedRoute: ActivatedRoute,
    private theCepService: CepService,
    private theFieldsService: FieldsService,
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
    if (this.theInscricao.length > 0) {
      this.theUnsubscribeControl.unsubscribe(this.theInscricao);
    }
    this.getTheForm = null;
    this.theInscricao = null;
  }

  ngOnInit() {
    this.theForm = this.theFormBuilder.group({
      id: [{ value: '', disabled: true }],
      dtCriacao: [{ value: '', disabled: true }],
      file: [''],
      bairro: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      cidade: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      cep: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(8), Validators.pattern(this.thePatternService.getRegExpCep())]],
      dataNascimento: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.maxLength(120), Validators.email]],
      estado: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      genero: ['', [Validators.required]],
      logradouro: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(1)]],
      nome: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(4), Validators.pattern(this.thePatternService.getRegExpOnlyLetters())]],
      numeroTelefone1: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(10)]],
      pais: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      senha: ['', [Validators.maxLength(20), Validators.minLength(6)]],
      status: ['', [Validators.required]],
      tipoTelefone1: ['', [Validators.required]],
    });
    if (this.theSeguidorService.getISeguidorDTO() == null) {
      this.theActivatedRoute.params.pipe(
        map((params: any) => params['id']),
        switchMap(id => this.theSeguidorService.find(id))
      ).subscribe(theISeguidorDTO => this.onFormUpdate(theISeguidorDTO));
    } else {
      this.onFormUpdate(this.theSeguidorService.getISeguidorDTO());
    }
  }

  onClear() {
    this.getTheForm().reset();
    this.url = null;
    this.format = null;
    this.theFile = null;
  }

  onFormUpdate(theISeguidorDTO: ISeguidorDTO): void {
    this.format = 'image';
    this.url = theISeguidorDTO.urlImgPerfil;
    this.getTheForm().patchValue({
      id: theISeguidorDTO.id,
      dtCriacao: theISeguidorDTO.dtCriacao,
      file: '',
      bairro: theISeguidorDTO.bairro,
      cidade: theISeguidorDTO.cidade,
      cep: theISeguidorDTO.cep,
      dataNascimento: new Date(theISeguidorDTO.dataNascimento.toString()),
      email: theISeguidorDTO.email,
      estado: theISeguidorDTO.estado,
      genero: this.theFieldsService.getItemOfSelect(this.getOptionsGenero(), theISeguidorDTO.genero),
      logradouro: theISeguidorDTO.logradouro,
      nome: theISeguidorDTO.nome,
      numeroTelefone1: theISeguidorDTO.numeroTelefone1,
      pais: theISeguidorDTO.pais,
      status: this.theFieldsService.getItemOfSelect(this.getOptionsStatus(), theISeguidorDTO.statusPessoa),
      tipoTelefone1: this.theFieldsService.getItemOfSelect(this.getOptionsTipoTelefone(), theISeguidorDTO.tipoTelefone1),
    });
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
        formData.append('cidade', this.getTheForm().get('cidade').value);
        formData.append('cep', this.getTheForm().get('cep').value);
        formData.append('dataNascimento', new Date(this.getTheForm().get('dataNascimento').value).toLocaleDateString());
        formData.append('email', this.getTheForm().get('email').value);
        formData.append('estado', this.getTheForm().get('estado').value);
        formData.append('genero', this.getTheForm().get('genero').value);
        formData.append('logradouro', this.getTheForm().get('logradouro').value);
        formData.append('nome', this.getTheForm().get('nome').value);
        formData.append('numeroTelefone1', this.getTheForm().get('numeroTelefone1').value);
        formData.append('pais', this.getTheForm().get('pais').value);
        formData.append('senha', this.getTheForm().get('senha').value);
        formData.append('statusPessoa', this.getTheForm().get('status').value);
        formData.append('tipoTelefone1', this.getTheForm().get('tipoTelefone1').value);
        if (this.getTheFile()) {
          formData.append('file', this.getTheFile(), this.getTheFile().name);
        }
        this.theInscricao.push(this.theSeguidorService.update(formData, this.getTheForm().get('id').value)
          .subscribe((event: HttpEvent<Object>) => {
            if (event.type === HttpEventType.Response) {
              this.dialog.closeAll();
              let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
              let instance = dialogRef.componentInstance;
              instance.title = "Status: " + event.status;
              instance.subTitle = 'Alterado!...';
              instance.classCss = 'color-success';
              instance.message = event.statusText + '!! O Seguidor foi alterado com sucesso!';
              instance.urlNavigate = '/seguidores';
              FormData = null;
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
}
