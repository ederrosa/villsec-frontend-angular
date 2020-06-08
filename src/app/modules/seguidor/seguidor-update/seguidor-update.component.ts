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

@Component({
  selector: 'app-seguidor-update',
  templateUrl: './seguidor-update.component.html',
  styleUrls: ['./seguidor-update.component.scss']
})
export class SeguidorUpdateComponent implements OnInit, OnDestroy {

  theForm: FormGroup;
  url: any;
  format: string;
  private theFile: File;
  private theInscricao: Subscription[] = new Array<Subscription>();
  optionsTipoTelefone: IOptions[] = [
    { value: 1, option: 'Celular' },
    { value: 2, option: 'Corporativo' },
    { value: 3, option: 'Recado' },
    { value: 4, option: 'Residêncial' },
    { value: 5, option: 'SAC' },
    { value: 6, option: 'Whatsapp' }];
  optionsGenero: IOptions[] = [
    { value: 'Masculino', option: 'Masculino' },
    { value: 'Feminino', option: 'Feminino' }];
  optionsStatus: IOptions[] = [
    { value: true, option: 'Ativo' },
    { value: false, option: 'Inativo' }];

  constructor(
    private theSeguidorService: SeguidorService,
    private theActivatedRoute: ActivatedRoute,
    private theCepService: CepService,
    private theFieldsService: FieldsService,
    private theFormBuilder: FormBuilder,
    private dialog: MatDialog,
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
      id: [''],
      dtCriacao: [''],
      file: [''],
      bairro: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      cidade: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      cep: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(8)]],
      dataNascimento: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.maxLength(120), Validators.email]],
      estado: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      genero: ['', [Validators.required]],
      logradouro: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(1)]],
      nome: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(4)]],
      numeroTelefone1: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(4)]],
      pais: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      senha: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(6)]],
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

  ngOnDestroy() {
    this.onClear();
    this.theUnsubscribeControl.unsubscribe(this.theInscricao);
  }

  onFormUpdate(theISeguidorDTO: ISeguidorDTO): void {
    this.format = 'image';
    this.url = theISeguidorDTO.urlImgPerfil;
    this.theForm.patchValue({
      id: theISeguidorDTO.id,
      dtCriacao: theISeguidorDTO.dtCriacao,
      file: '',
      bairro: theISeguidorDTO.bairro,
      cidade: theISeguidorDTO.cidade,
      cep: theISeguidorDTO.cep,
      dataNascimento: new Date(theISeguidorDTO.dataNascimento.toString()),
      email: theISeguidorDTO.email,
      estado: theISeguidorDTO.estado,
      genero: this.theFieldsService.getItemOfSelect(this.optionsGenero, theISeguidorDTO.genero),
      logradouro: theISeguidorDTO.logradouro,
      nome: theISeguidorDTO.nome,
      numeroTelefone1: theISeguidorDTO.numeroTelefone1,
      pais: theISeguidorDTO.pais,
      senha: theISeguidorDTO.senha,
      status: this.theFieldsService.getItemOfSelect(this.optionsStatus, theISeguidorDTO.statusPessoa),
      tipoTelefone1: this.theFieldsService.getItemOfSelect(this.optionsTipoTelefone, theISeguidorDTO.tipoTelefone1),
    });
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
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(ConfirmationAlertComponent, { disableClose: true, width: '40%' });
    let instance = dialogRef.componentInstance;
    instance.title = 'Você deseja proceguir com a alteração?';
    instance.subTitle = 'Confirma a alteração';
    instance.classCss = 'color-danger';
    this.theInscricao.push(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let formData: FormData = new FormData();
        formData.append('bairro', this.theForm.get('bairro').value);
        formData.append('cidade', this.theForm.get('cidade').value);
        formData.append('cep', this.theForm.get('cep').value);
        formData.append('dataNascimento', this.theForm.get('dataNascimento').value);
        formData.append('email', this.theForm.get('email').value);
        formData.append('estado', this.theForm.get('estado').value);
        formData.append('genero', this.theForm.get('genero').value);
        formData.append('logradouro', this.theForm.get('logradouro').value);
        formData.append('nome', this.theForm.get('nome').value);
        formData.append('numeroTelefone1', this.theForm.get('numeroTelefone1').value);
        formData.append('pais', this.theForm.get('pais').value);
        formData.append('senha', this.theForm.get('senha').value);
        formData.append('statusPessoa', this.theForm.get('status').value);
        formData.append('tipoTelefone1', this.theForm.get('tipoTelefone1').value);
        if (this.theFile) {
          formData.append('file', this.theFile, this.theFile.name);
        }
        this.theInscricao.push(this.theSeguidorService.update(formData, this.theForm.get('id').value)
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
