import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpEventType, HttpEvent } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { MusicaService } from '../musica.service';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { ProgressSpinnerOverviewComponent } from 'src/app/shared/components/progress-spinner/progress-spinner-overview/progress-spinner-overview.component';
import { InformativeAlertComponent } from 'src/app/shared/components/alerts/informative-alert/informative-alert.component';
import { ConfirmationAlertComponent } from 'src/app/shared/components/alerts/confirmation-alert/confirmation-alert.component';
import { FieldsService } from 'src/app/shared/components/fields/fields.service';
import { switchMap, map } from 'rxjs/operators';
import { IMusicaDTO } from 'src/app/shared/models/dtos/imusica-dto';
import { IOptions } from 'src/app/shared/components/fields/select/select.component';
import { AlbumService } from '../../album/album.service';
import { PatternService } from 'src/app/core/services/pattern.service';

@Component({
  selector: 'app-musica-update',
  templateUrl: './musica-update.component.html',
  styleUrls: ['./musica-update.component.scss']
})
export class MusicaUpdateComponent implements OnInit, OnDestroy, AfterViewInit {

  private format: string;
  private readonly linear: boolean = true;
  private readonly optionsCopyright: IOptions[] = [
    { value: true, option: 'Sim' },
    { value: false, option: 'Não' }];
  private theAlbumForm: FormGroup;
  private theForm: FormGroup;
  private theFile: File;
  private theInscricao: Subscription[] = new Array<Subscription>();
  private url: any;

  constructor(
    private dialog: MatDialog,
    private theActivatedRoute: ActivatedRoute,
    private theAlbumService: AlbumService,
    private theFieldsService: FieldsService,
    private theFormBuilder: FormBuilder,
    private theMusicaService: MusicaService,
    private thePatternService: PatternService,
    private theUnsubscribeControl: UnsubscribeControlService
  ) { }

  getFormat(): string {
    return this.format;
  }

  getOptionsCopyright(): IOptions[] {
    return this.optionsCopyright;
  }

  getTheAlbumForm(): FormGroup {
    return this.theAlbumForm;
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
    this.theInscricao.push(this.theAlbumService.eventEmitter.subscribe(
      theAlbum => {
        this.getTheAlbumForm().patchValue({
          theAlbumID: theAlbum.id
        });
      }
    ));
  }

  ngOnDestroy() {
    this.onClear();
    if (this.theInscricao.length > 0) {
      this.theUnsubscribeControl.unsubscribe(this.theInscricao);
    }
    this.theAlbumForm = null;
    this.theForm = null;
    this.theInscricao = null;
  }

  ngOnInit() {
    this.theForm = this.theFormBuilder.group({
      id: [{ value: '', disabled: true }],
      dtCriacao: [{ value: '', disabled: true }],
      autor: ['', [Validators.required]],
      bpm: ['', [Validators.required]],
      coautor: ['', [Validators.required]],
      copyright: ['', [Validators.required]],
      duracao: ['', [Validators.required]],
      faixa: ['', [Validators.required]],
      file: [''],
      idioma: ['', [Validators.required]],
      nome: ['', [Validators.required]],
    });
    this.theAlbumForm = this.theFormBuilder.group({
      theAlbumID: ['', [Validators.required]]
    });
    if (this.theMusicaService.getIMusicaDTO() == null) {
      this.theActivatedRoute.params.pipe(
        map((params: any) => params['id']),
        switchMap(id => this.theMusicaService.find(id))
      ).subscribe(theIMusicaDTO => this.onFormUpdate(theIMusicaDTO));
    } else {
      this.onFormUpdate(this.theMusicaService.getIMusicaDTO());
    }
  }

  onClear() {
    this.getTheForm().reset();
    this.url = null;
    this.format = null;
    this.theFile = null;
  }

  onFormUpdate(theIMusicaDTO: IMusicaDTO): void {
    this.url = theIMusicaDTO.arquivoUrl;
    this.format = 'audio';
    this.getTheForm().patchValue({
      id: theIMusicaDTO.id,
      dtCriacao: theIMusicaDTO.dtCriacao,
      autor: theIMusicaDTO.autor,
      bpm: theIMusicaDTO.bpm,
      coautor: theIMusicaDTO.coautor,
      copyright: this.theFieldsService.getItemOfSelect(this.getOptionsCopyright(), theIMusicaDTO.copyright),
      duracao: theIMusicaDTO.duracao,
      file: '',
      faixa: theIMusicaDTO.faixa,
      idioma: theIMusicaDTO.idioma,
      nome: theIMusicaDTO.nome,
    });
  }

  onSelectFile(event) {
    this.theFile = event.target.files && event.target.files[0];
    if (this.getTheFile()) {
      var reader = new FileReader();
      reader.readAsDataURL(this.getTheFile());
      if (this.getTheFile().type.indexOf('audio') > -1) {
        this.format = 'audio';
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
        formData.append('autor', this.getTheForm().get('autor').value);
        formData.append('bpm', this.getTheForm().get('bpm').value);
        formData.append('coautor', this.getTheForm().get('coautor').value);
        formData.append('copyright', this.getTheForm().get('copyright').value);
        formData.append('duracao', this.getTheForm().get('duracao').value);
        formData.append('idioma', this.getTheForm().get('idioma').value);
        formData.append('faixa', this.getTheForm().get('faixa').value);
        if (this.getTheFile()) {
          formData.append('file', this.getTheFile(), this.getTheFile().name);
        }
        formData.append('idioma', this.getTheForm().get('idioma').value);
        formData.append('nome', this.getTheForm().get('nome').value);
        this.theInscricao.push(this.theMusicaService.update(formData, this.getTheForm().get('id').value)
          .subscribe((event: HttpEvent<Object>) => {
            if (event.type === HttpEventType.Response) {
              this.dialog.closeAll();
              let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
              let instance = dialogRef.componentInstance;
              instance.title = "Status: " + event.status;
              instance.subTitle = 'Alterado!...';
              instance.classCss = 'color-success';
              instance.message = event.statusText + '!! A Musica foi alterada com sucesso!';
              instance.urlNavigate = '/musicas';
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
