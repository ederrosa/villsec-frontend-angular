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

@Component({
  selector: 'app-musica-update',
  templateUrl: './musica-update.component.html',
  styleUrls: ['./musica-update.component.scss']
})
export class MusicaUpdateComponent implements OnInit, OnDestroy, AfterViewInit{

  isLinear = true;
  theForm: FormGroup;
  theAlbumForm: FormGroup;
  url: any;
  format: string;
  private theFile: File;
  private theInscricao: Subscription[] = new Array<Subscription>();
  optionsCopyright: IOptions[] = [
    { value: true, option: 'Sim' },
    { value: false, option: 'Não' }];

  constructor(
    private theMusicaService: MusicaService,
    private theAlbumService: AlbumService,
    private theActivatedRoute: ActivatedRoute,
    private theFieldsService: FieldsService,
    private theFormBuilder: FormBuilder,
    private dialog: MatDialog,
    private theUnsubscribeControl: UnsubscribeControlService
  ) { }

  ngAfterViewInit(): void {
    this.theInscricao.push(this.theAlbumService.eventEmitter.subscribe(
      theAlbum => {
        this.theAlbumForm.patchValue({
          theAlbumID: theAlbum.id
        });
      }
    ));
  }

  ngOnInit() {
    this.theForm = this.theFormBuilder.group({
      id: [''],
      dtCriacao: [''],
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

  ngOnDestroy() {
    this.onClear();
    this.theUnsubscribeControl.unsubscribe(this.theInscricao);
  }

  onFormUpdate(theIMusicaDTO: IMusicaDTO): void {
    this.url = theIMusicaDTO.arquivoUrl;
    this.format = 'audio';
    this.theForm.patchValue({
      id: theIMusicaDTO.id,
      dtCriacao: theIMusicaDTO.dtCriacao,
      autor: theIMusicaDTO.autor,
      bpm: theIMusicaDTO.bpm,
      coautor: theIMusicaDTO.coautor,
      copyright: this.theFieldsService.getItemOfSelect(this.optionsCopyright, theIMusicaDTO.copyright),
      duracao: theIMusicaDTO.duracao,
      file: '',
      faixa: theIMusicaDTO.faixa,
      idioma: theIMusicaDTO.idioma,
      nome: theIMusicaDTO.nome,     
    });
  }

  onSelectFile(event) {
    this.theFile = event.target.files && event.target.files[0];
    if (this.theFile) {
      var reader = new FileReader();
      reader.readAsDataURL(this.theFile);
      if (this.theFile.type.indexOf('audio') > -1) {
        this.format = 'audio';
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
        formData.append('autor', this.theForm.get('autor').value);
        formData.append('bpm', this.theForm.get('bpm').value);
        formData.append('coautor', this.theForm.get('coautor').value);
        formData.append('copyright', this.theForm.get('copyright').value);
        formData.append('duracao', this.theForm.get('duracao').value);
        formData.append('idioma', this.theForm.get('idioma').value);
        formData.append('faixa', this.theForm.get('faixa').value);
        if (this.theFile) {
          formData.append('file', this.theFile, this.theFile.name);
        } 
        formData.append('idioma', this.theForm.get('idioma').value);
        formData.append('nome', this.theForm.get('nome').value);
        formData.append('albumID', this.theAlbumForm.get('theAlbumID').value);
        this.theInscricao.push(this.theMusicaService.update(formData, this.theForm.get('id').value)
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
