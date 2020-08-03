import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpEventType, HttpEvent } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { AlbumService } from '../album.service';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { ProgressSpinnerOverviewComponent } from 'src/app/shared/components/progress-spinner/progress-spinner-overview/progress-spinner-overview.component';
import { InformativeAlertComponent } from 'src/app/shared/components/alerts/informative-alert/informative-alert.component';
import { ConfirmationAlertComponent } from 'src/app/shared/components/alerts/confirmation-alert/confirmation-alert.component';
import { switchMap, map } from 'rxjs/operators';
import { IAlbumDTO } from 'src/app/shared/models/dtos/ialbum-dto';

@Component({
  selector: 'app-album-update',
  templateUrl: './album-update.component.html',
  styleUrls: ['./album-update.component.scss']
})
export class AlbumUpdateComponent implements OnInit {

  private format: string;
  private theFile: File;
  private theForm: FormGroup;
  private theInscricao: Subscription[] = new Array<Subscription>();
  private url: any;

  constructor(
    private dialog: MatDialog,
    private theActivatedRoute: ActivatedRoute,
    private theAlbumService: AlbumService,
    private theFormBuilder: FormBuilder,
    private theUnsubscribeControl: UnsubscribeControlService
  ) { }

  getTheForm(): FormGroup {
    return this.theForm;
  }

  getUrl() {
    return this.url;
  }

  getTheFile(): File {
    return this.theFile;
  }

  getFormat() {
    return this.format;
  }

  ngOnDestroy() {
    this.onClear();
    if (this.theInscricao.length > 0) {
      this.theUnsubscribeControl.unsubscribe(this.theInscricao);
    }
    this.theInscricao = null;
  }

  onClear() {
    this.getTheForm().reset();
    this.url = null;
    this.format = null;
    this.theFile = null;
  }

  ngOnInit() {
    this.theForm = this.theFormBuilder.group({
      id: [{ value: '', disabled: true }],
      dtCriacao: [{ value: '', disabled: true }],
      file: [''],
      nome: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      ano: ['', [Validators.required]],
      genero: ['', [Validators.required]]
    });
    if (this.theAlbumService.getIAlbumDTO() == null) {
      this.theActivatedRoute.params.pipe(
        map((params: any) => params['id']),
        switchMap(id => this.theAlbumService.find(id))
      ).subscribe(theIAlbumDTO => this.onFormUpdate(theIAlbumDTO));
    } else {
      this.onFormUpdate(this.theAlbumService.getIAlbumDTO());
    }
  }

  onFormUpdate(theIAlbumDTO: IAlbumDTO): void {
    this.format = 'image';
    this.url = theIAlbumDTO.capaUrl;
    this.getTheForm().patchValue({
      id: theIAlbumDTO.id,
      dtCriacao: theIAlbumDTO.dtCriacao,
      file: '',
      nome: theIAlbumDTO.nome,
      descricao: theIAlbumDTO.descricao,
      ano: new Date(theIAlbumDTO.ano.toString()),
      genero: theIAlbumDTO.genero,
    });
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
        formData.append('ano', this.getTheForm().get('ano').value);
        formData.append('descricao', this.getTheForm().get('descricao').value);
        formData.append('genero', this.getTheForm().get('genero').value);
        formData.append('nome', this.getTheForm().get('nome').value);
        if (this.getTheFile()) {
          formData.append('file', this.getTheFile(), this.getTheFile().name);
        }
        this.theInscricao.push(this.theAlbumService.update(formData, this.getTheForm().get('id').value)
          .subscribe((event: HttpEvent<Object>) => {
            if (event.type === HttpEventType.Response) {
              this.dialog.closeAll();
              let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
              let instance = dialogRef.componentInstance;
              instance.title = "Status: " + event.status;
              instance.subTitle = 'Alterado!...';
              instance.classCss = 'color-success';
              instance.message = event.statusText + '!! O Album foi alterada com sucesso!';
              instance.urlNavigate = '/albuns';
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
}
