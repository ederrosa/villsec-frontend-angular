import { Component, OnInit } from '@angular/core';
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


@Component({
  selector: 'app-evento-update',
  templateUrl: './evento-update.component.html',
  styleUrls: ['./evento-update.component.scss']
})
export class EventoUpdateComponent implements OnInit {

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
    private theEventoService: EventoService,
    private theActivatedRoute: ActivatedRoute,
    private theFieldsService: FieldsService,
    private theFormBuilder: FormBuilder,
    private dialog: MatDialog,
    private theUnsubscribeControl: UnsubscribeControlService
  ) { }

  ngOnInit() {
    this.theForm = this.theFormBuilder.group({
      id: [''],
      dtCriacao: [''],
      file: [''],
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
    if (this.theEventoService.getIEventoDTO() == null) {
      this.theActivatedRoute.params.pipe(
        map((params: any) => params['id']),
        switchMap(id => this.theEventoService.find(id))
      ).subscribe(theIEventoDTO => this.onFormUpdate(theIEventoDTO));
    } else {
      this.onFormUpdate(this.theEventoService.getIEventoDTO());
    }
  }

  ngOnDestroy() {
    this.onClear();
    this.theUnsubscribeControl.unsubscribe(this.theInscricao);
  }

  onFormUpdate(theIEventoDTO: IEventoDTO): void {
    this.format = 'image';
    this.url = theIEventoDTO.folderUrl;
    this.theForm.patchValue({
      id: theIEventoDTO.id,
      dtCriacao: theIEventoDTO.dtCriacao,
      file: '',
      classificacao: theIEventoDTO.classificacao,
      diaInicio: new Date(theIEventoDTO.diaInicio.toString()),
      diaTermino: new Date(theIEventoDTO.diaTermino.toString()),
      descricao: theIEventoDTO.descricao,
      horaInicio:  theIEventoDTO.horaInicio.toString(),
      horaTermino: theIEventoDTO.horaTermino.toString(),
      nome: theIEventoDTO.nome,
      tipoEvento: this.theFieldsService.getItemOfSelect(this.optionsTipoEvento, theIEventoDTO.tipoEvento),
      logradouro: theIEventoDTO.logradouro,
      cep: theIEventoDTO.cep,
      bairro: theIEventoDTO.bairro,
      cidade: theIEventoDTO.cidade,
      estado: theIEventoDTO.estado,
      pais: theIEventoDTO.pais   
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
        formData.append('classificacao', this.theForm.get('classificacao').value);
        formData.append('diaInicio', new Date(this.theForm.get('diaInicio').value).toLocaleDateString());
        formData.append('diaTermino', new Date(this.theForm.get('diaTermino').value).toLocaleDateString());
        formData.append('descricao', this.theForm.get('descricao').value);
        if (this.theFile) {
          formData.append('file', this.theFile, this.theFile.name);
        }
        formData.append('horaInicio', this.theForm.get('horaInicio').value);
        formData.append('horaTerminio', this.theForm.get('horaTermino').value);
        formData.append('tipoEvento', this.theForm.get('tipoEvento').value);
        formData.append('nome', this.theForm.get('nome').value);
        formData.append('logradouro', this.theForm.get('logradouro').value);
        formData.append('cep', this.theForm.get('cep').value);
        formData.append('bairro', this.theForm.get('bairro').value);
        formData.append('cidade', this.theForm.get('cidade').value);
        formData.append('estado', this.theForm.get('estado').value);
        formData.append('pais', this.theForm.get('pais').value); 
        this.theInscricao.push(this.theEventoService.update(formData, this.theForm.get('id').value)
          .subscribe((event: HttpEvent<Object>) => {
            if (event.type === HttpEventType.Response) {
              this.dialog.closeAll();
              let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
              let instance = dialogRef.componentInstance;
              instance.title = "Status: " + event.status;
              instance.subTitle = 'Alterado!...';
              instance.classCss = 'color-success';
              instance.message = event.statusText + '!! O Evento foi alterada com sucesso!';
              instance.urlNavigate = '/eventos';
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
