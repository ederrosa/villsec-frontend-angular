import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpEventType, HttpEvent } from '@angular/common/http';

import { Subscription } from 'rxjs';
import { MusicaService } from '../musica.service';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { ProgressSpinnerOverviewComponent } from 'src/app/shared/components/progress-spinner/progress-spinner-overview/progress-spinner-overview.component';
import { InformativeAlertComponent } from 'src/app/shared/components/alerts/informative-alert/informative-alert.component';
import { IOptions } from 'src/app/shared/components/fields/select/select.component';
import { AlbumService } from '../../album/album.service';

@Component({
  selector: 'app-musica-insert',
  templateUrl: './musica-insert.component.html',
  styleUrls: ['./musica-insert.component.scss']
})
export class MusicaInsertComponent implements OnInit, OnDestroy, AfterViewInit {

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
    private theFormBuilder: FormBuilder,
    private dialog: MatDialog,
    private theAlbumService: AlbumService,
    private theMusicaService: MusicaService,    
    private theUnsubscribeControl: UnsubscribeControlService,
    
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
      autor: ['', [Validators.required]],
      bpm: ['', [Validators.required]],
      coautor: ['', [Validators.required]],
      copyright: ['', [Validators.required]],
      duracao: ['', [Validators.required]],
      faixa: ['', [Validators.required]],
      file: ['', [Validators.required]],
      idioma: ['', [Validators.required]],
      nome: ['', [Validators.required]],   
    });
    this.theAlbumForm = this.theFormBuilder.group({
      theAlbumID: ['', [Validators.required]]
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
    let formData: FormData = new FormData();
    formData.append('autor', this.theForm.get('autor').value);
    formData.append('bpm', this.theForm.get('bpm').value);
    formData.append('coautor', this.theForm.get('coautor').value);
    formData.append('copyright', this.theForm.get('copyright').value);
    formData.append('duracao', this.theForm.get('duracao').value);
    formData.append('faixa', this.theForm.get('faixa').value);
    formData.append('file', this.theFile, this.theFile.name);
    formData.append('idioma', this.theForm.get('idioma').value);
    formData.append('nome', this.theForm.get('nome').value);
    formData.append('albumID', this.theAlbumForm.get('theAlbumID').value);
    let dialogRef = this.dialog.open(ProgressSpinnerOverviewComponent, { disableClose: true, width: '350px', height: '350px' });
    this.theInscricao.push(this.theMusicaService.insert(formData)
      .subscribe((event: HttpEvent<Object>) => {
        if (event.type === HttpEventType.Response) {
          this.dialog.closeAll();
          let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
          let instance = dialogRef.componentInstance;
          instance.title = "Status: " + event.status;
          instance.subTitle = 'OK!...';
          instance.classCss = 'color-success';
          instance.message = event.statusText + '!! A nova música foi armazenada com sucesso!';
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
