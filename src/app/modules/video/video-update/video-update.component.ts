import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpEventType, HttpEvent } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { VideoService } from '../video.service';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { ProgressSpinnerOverviewComponent } from 'src/app/shared/components/progress-spinner/progress-spinner-overview/progress-spinner-overview.component';
import { InformativeAlertComponent } from 'src/app/shared/components/alerts/informative-alert/informative-alert.component';
import { ConfirmationAlertComponent } from 'src/app/shared/components/alerts/confirmation-alert/confirmation-alert.component';
import { switchMap, map } from 'rxjs/operators';
import { IVideoDTO } from 'src/app/shared/models/dtos/ivideo-dto';
import { GaleriaService } from '../../galeria/galeria.service';
import { PatternService } from 'src/app/core/services/pattern.service';

@Component({
  selector: 'app-video-update',
  templateUrl: './video-update.component.html',
  styleUrls: ['./video-update.component.scss']
})
export class VideoUpdateComponent implements OnInit, OnDestroy, AfterViewInit {

  private format: string;
  private readonly linear: boolean = true;
  private theGaleriaForm: FormGroup;
  private theForm: FormGroup;
  private theFile: File;
  private theInscricao: Subscription[] = new Array<Subscription>();
  private url: any;

  constructor(
    private dialog: MatDialog,
    private theActivatedRoute: ActivatedRoute,
    private theGaleriaService: GaleriaService,
    private theFormBuilder: FormBuilder,
    private thePatternService: PatternService,
    private theVideoService: VideoService,
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
    this.theUnsubscribeControl.unsubscribe(this.theInscricao);
  }

  ngOnInit() {
    this.theForm = this.theFormBuilder.group({
      id: [''],
      dtCriacao: [''],
      descricao: ['', [Validators.required]],
      embed: ['', [Validators.pattern(this.thePatternService.getRegexUrl())]],
      titulo: ['', [Validators.required]],
    });
    this.theGaleriaForm = this.theFormBuilder.group({
      theGaleriaID: ['', [Validators.required]]
    });
    if (this.theVideoService.getIVideoDTO() == null) {
      this.theActivatedRoute.params.pipe(
        map((params: any) => params['id']),
        switchMap(id => this.theVideoService.find(id))
      ).subscribe(theIVideoDTO => this.onFormUpdate(theIVideoDTO));
    } else {
      this.onFormUpdate(this.theVideoService.getIVideoDTO());
    }
  }

  onClear() {
    this.getTheForm().reset();
    this.url = null;
    this.format = null;
    this.theFile = null;
  }

  onFormUpdate(theIVideoDTO: IVideoDTO): void {
    if (theIVideoDTO.arquivoUrl != null && theIVideoDTO.arquivoUrl != '') {
      this.format = 'video';
      this.url = theIVideoDTO.arquivoUrl;
    } else if (theIVideoDTO.embed != null && theIVideoDTO.embed != '') {
      this.url = theIVideoDTO.embed;
    }      
    this.getTheForm().patchValue({
      id: theIVideoDTO.id,
      dtCriacao: theIVideoDTO.dtCriacao,
      descricao: theIVideoDTO.descricao,
      embed: theIVideoDTO.embed,
      titulo: theIVideoDTO.titulo
    });
  }

  onSelectFile(event) {
    this.theFile = event.target.files && event.target.files[0];
    if (this.getTheFile()) {
      var reader = new FileReader();
      reader.readAsDataURL(this.getTheFile());
      if (this.getTheFile().type.indexOf('video') > -1) {
        this.format = 'video';
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
        formData.append('embed', this.getTheForm().get('embed').value);
        formData.append('titulo', this.getTheForm().get('titulo').value);
        if (this.getTheFile()) {
          formData.append('file', this.getTheFile(), this.getTheFile().name);
        }
        this.theInscricao.push(this.theVideoService.update(formData, this.getTheForm().get('id').value)
          .subscribe((event: HttpEvent<Object>) => {
            if (event.type === HttpEventType.Response) {
              this.dialog.closeAll();
              let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
              let instance = dialogRef.componentInstance;
              instance.title = "Status: " + event.status;
              instance.subTitle = 'Alterado!...';
              instance.classCss = 'color-success';
              instance.message = event.statusText + '!! A Video foi alterado com sucesso!';
              instance.urlNavigate = '/videos';
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

  setUrl() {
    if (this.theForm.get('embed').valid) {
      this.url = this.getTheForm().get('embed').value;
      this.format = null;
      this.theFile = null;
    }
  }
}
