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
import { FieldsService } from 'src/app/shared/components/fields/fields.service';
import { switchMap, map } from 'rxjs/operators';
import { IAlbumDTO } from 'src/app/shared/models/dtos/ialbum-dto';


@Component({
  selector: 'app-album-update',
  templateUrl: './album-update.component.html',
  styleUrls: ['./album-update.component.scss']
})
export class AlbumUpdateComponent implements OnInit {

  theForm: FormGroup;
  url: any;
  format: string;
  private theFile: File;
  private theInscricao: Subscription[] = new Array<Subscription>();

  constructor(
    private theAcademiaService: AlbumService,
    private theActivatedRoute: ActivatedRoute,
    private theFieldsService: FieldsService,
    private theFormBuilder: FormBuilder,
    private theAlbumService: AlbumService,
    private dialog: MatDialog,
    private theUnsubscribeControl: UnsubscribeControlService
  ) { }

  ngOnInit() {
    this.theForm = this.theFormBuilder.group({
      id: [''],
      dtCriacao: [''],
      file: [''],
      nome: ['', [Validators.required]],
      ano: ['', [Validators.required]],
      genero: ['', [Validators.required]]
    });
    if (this.theAcademiaService.theAlbum == null) {
      this.theActivatedRoute.params.pipe(
        map((params: any) => params['id']),
        switchMap(id => this.theAcademiaService.find(id))
      ).subscribe(theAlbum => this.onFormUpdate(theAlbum));
    } else {
      this.onFormUpdate(this.theAlbumService.theAlbum);
    }
  }

  ngOnDestroy() {
    this.onClear();
    this.theUnsubscribeControl.unsubscribe(this.theInscricao);
  }

  onFormUpdate(theAlbum: IAlbumDTO): void {
    this.format = 'image';
    this.url = theAlbum.capaUrl;
    this.theForm.patchValue({
      id: theAlbum.id,
      dtCriacao: theAlbum.dtCriacao,
      file: '',
      nome: theAlbum.nome,
      ano: new Date(theAlbum.ano.toString()),
      genero: theAlbum.genero,
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
        formData.append('ano', this.theForm.get('ano').value);
        formData.append('genero', this.theForm.get('genero').value);
        formData.append('nome', this.theForm.get('nome').value);
        if (this.theFile) {
          formData.append('file', this.theFile, this.theFile.name);
        }
        this.theInscricao.push(this.theAlbumService.update(formData, this.theForm.get('id').value)
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

}
