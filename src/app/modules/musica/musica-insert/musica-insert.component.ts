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
    private theAlbumService: AlbumService,
    private theFormBuilder: FormBuilder,    
    private theMusicaService: MusicaService,
    private theUnsubscribeControl: UnsubscribeControlService,
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
    this.theUnsubscribeControl.unsubscribe(this.theInscricao);
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

  onClear() {
    this.getTheForm().reset();
    this.url = null;
    this.format = null;
    this.theFile = null;
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
    let formData: FormData = new FormData();
    formData.append('autor', this.getTheForm().get('autor').value);
    formData.append('bpm', this.getTheForm().get('bpm').value);
    formData.append('coautor', this.getTheForm().get('coautor').value);
    formData.append('copyright', this.getTheForm().get('copyright').value);
    formData.append('duracao', this.getTheForm().get('duracao').value);
    formData.append('faixa', this.getTheForm().get('faixa').value);
    formData.append('file', this.getTheFile(), this.getTheFile().name);
    formData.append('idioma', this.getTheForm().get('idioma').value);
    formData.append('nome', this.getTheForm().get('nome').value);
    formData.append('albumID', this.getTheAlbumForm().get('theAlbumID').value);
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
