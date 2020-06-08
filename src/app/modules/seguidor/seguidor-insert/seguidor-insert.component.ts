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

@Component({
  selector: 'app-seguidor-insert',
  templateUrl: './seguidor-insert.component.html',
  styleUrls: ['./seguidor-insert.component.scss']
})
export class SeguidorInsertComponent implements OnInit {

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
    private theFormBuilder: FormBuilder,
    private theSeguidorService: SeguidorService,
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
      bairro: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      cidade: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      cep: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(8)]],
      dataNascimento: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.maxLength(120), Validators.email]],
      estado: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      file: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      logradouro: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(1)]],
      nome: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(4)]],
      numeroTelefone1: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(4)]],
      pais: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      senha: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(6)]],
      status: ['', [Validators.required]],
      tipoTelefone1: ['', [Validators.required]],
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
    formData.append('bairro', this.theForm.get('bairro').value);
    formData.append('cidade', this.theForm.get('cidade').value);
    formData.append('cep', this.theForm.get('cep').value);
    formData.append('dataNascimento', this.theForm.get('dataNascimento').value);
    formData.append('email', this.theForm.get('email').value);
    formData.append('estado', this.theForm.get('estado').value);
    formData.append('file', this.theForm.get('file').value);
    formData.append('genero', this.theForm.get('genero').value);
    formData.append('logradouro', this.theForm.get('logradouro').value);
    formData.append('nome', this.theForm.get('nome').value);
    formData.append('numeroTelefone1', this.theForm.get('numeroTelefone1').value);
    formData.append('pais', this.theForm.get('pais').value);
    formData.append('senha', this.theForm.get('senha').value);
    formData.append('status', this.theForm.get('status').value);
    formData.append('tipoTelefone1', this.theForm.get('tipoTelefone1').value);
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
