import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpEventType, HttpEvent } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { ImagemService } from '../imagem.service';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { ProgressSpinnerOverviewComponent } from 'src/app/shared/components/progress-spinner/progress-spinner-overview/progress-spinner-overview.component';
import { InformativeAlertComponent } from 'src/app/shared/components/alerts/informative-alert/informative-alert.component';
import { ConfirmationAlertComponent } from 'src/app/shared/components/alerts/confirmation-alert/confirmation-alert.component';
import { switchMap, map } from 'rxjs/operators';
import { IImagemDTO } from 'src/app/shared/models/dtos/iimagem-dto';
import { GaleriaService } from '../../galeria/galeria.service';

@Component({
  selector: 'app-imagem-update',
  templateUrl: './imagem-update.component.html',
  styleUrls: ['./imagem-update.component.scss']
})
export class ImagemUpdateComponent implements OnInit, OnDestroy, AfterViewInit {

  private format: string;
  private linear: boolean = true;
  private theForm: FormGroup;
  private theFile: File;
  private theGaleriaForm: FormGroup;
  private theInscricao: Subscription[] = new Array<Subscription>();
  private url: any;

  constructor(
    private dialog: MatDialog,
    private theActivatedRoute: ActivatedRoute,
    private theGaleriaService: GaleriaService,
    private theFormBuilder: FormBuilder,
    private theImagemService: ImagemService,
    private theUnsubscribeControl: UnsubscribeControlService
  ) { }

  getFormat(): string {
    return this.format;
  }

  getTheGaleriaForm(): FormGroup {
    return this.theGaleriaForm;
  }

  getTheForm(): FormGroup {
    return this.theForm;
  }

  getTheFile(): File {
    return this.theFile;
  }

  getUrl() {
    return this.url;
  }

  isLinear(): boolean {
    return this.linear;
  }

  ngAfterViewInit(): void {
    this.theInscricao.push(this.theGaleriaService.eventEmitter.subscribe(
      theGaleria => {
        this.getTheGaleriaForm().patchValue({
          theGaleriaID: theGaleria.id
        });
      }
    ));
  }

  ngOnDestroy() {
    this.onClear();
    if (this.theInscricao.length > 0) {
      this.theUnsubscribeControl.unsubscribe(this.theInscricao);
    }
    this.theGaleriaForm = null;
    this.theForm = null;
    this.theInscricao = null;
  }

  ngOnInit() {
    this.theForm = this.theFormBuilder.group({
      id: [{ value: '', disabled: true }],
      dtCriacao: [{ value: '', disabled: true }],
      descricao: ['', [Validators.required]],
      titulo: ['', [Validators.required]],
    });
    this.theGaleriaForm = this.theFormBuilder.group({
      theGaleriaID: ['', [Validators.required]]
    });
    if (this.theImagemService.getIImagemDTO() == null) {
      this.theActivatedRoute.params.pipe(
        map((params: any) => params['id']),
        switchMap(id => this.theImagemService.find(id))
      ).subscribe(theIImagemDTO => this.onFormUpdate(theIImagemDTO));
    } else {
      this.onFormUpdate(this.theImagemService.getIImagemDTO());
    }
  }

  onClear() {
    this.getTheForm().reset();
    this.url = null;
    this.format = null;
    this.theFile = null;
  }

  onFormUpdate(theIImagemDTO: IImagemDTO): void {
    this.format = 'image';
    this.url = theIImagemDTO.arquivoUrl;
    this.getTheForm().patchValue({
      id: theIImagemDTO.id,
      dtCriacao: theIImagemDTO.dtCriacao,
      descricao: theIImagemDTO.descricao,
      titulo: theIImagemDTO.titulo
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
        formData.append('descricao', this.getTheForm().get('descricao').value);
        formData.append('titulo', this.getTheForm().get('titulo').value);
        if (this.getTheFile()) {
          formData.append('file', this.getTheFile(), this.getTheFile().name);
        }
        this.theInscricao.push(this.theImagemService.update(formData, this.getTheForm().get('id').value)
          .subscribe((event: HttpEvent<Object>) => {
            if (event.type === HttpEventType.Response) {
              this.dialog.closeAll();
              let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
              let instance = dialogRef.componentInstance;
              instance.title = "Status: " + event.status;
              instance.subTitle = 'Alterado!...';
              instance.classCss = 'color-success';
              instance.message = event.statusText + '!! A Imagem foi alterada com sucesso!';
              instance.urlNavigate = '/imagens';
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
        FormData = null;
      }

    }));
  }
}
