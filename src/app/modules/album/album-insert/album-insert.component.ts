import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpEventType, HttpEvent } from '@angular/common/http';

import { Subscription } from 'rxjs';
import { AlbumService } from '../album.service';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { ProgressSpinnerOverviewComponent } from 'src/app/shared/components/progress-spinner/progress-spinner-overview/progress-spinner-overview.component';
import { InformativeAlertComponent } from 'src/app/shared/components/alerts/informative-alert/informative-alert.component';

@Component({
  selector: 'app-album-insert',
  templateUrl: './album-insert.component.html',
  styleUrls: ['./album-insert.component.scss']
})
export class AlbumInsertComponent implements OnInit {

  theForm: FormGroup;
  url: any;
  format: string;
  private theFile: File;
  private theInscricao: Subscription[] = new Array<Subscription>();
 
  constructor(
    private theFormBuilder: FormBuilder,
    private theAlbumService: AlbumService,
    private dialog: MatDialog,
    private theUnsubscribeControl: UnsubscribeControlService
  ) { }

  ngOnInit() {
    this.theForm = this.theFormBuilder.group({
      file: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      ano: ['', [Validators.required]],
      genero: ['', [Validators.required]]      
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
    formData.append('ano', this.theForm.get('ano').value);
    formData.append('genero', this.theForm.get('genero').value);
    formData.append('nome', this.theForm.get('nome').value);
    formData.append('file', this.theFile, this.theFile.name);
    let dialogRef = this.dialog.open(ProgressSpinnerOverviewComponent, { disableClose: true, width: '350px', height: '350px' });
    this.theInscricao.push(this.theAlbumService.insert(formData)
      .subscribe((event: HttpEvent<Object>) => {
        if (event.type === HttpEventType.Response) {
          this.dialog.closeAll();
          let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
          let instance = dialogRef.componentInstance;
          instance.title = "Status: " + event.status;
          instance.subTitle = 'OK!...';
          instance.classCss = 'color-success';
          instance.message = event.statusText + '!! O novo Album foi cadastrado com sucesso!';
          console.log(this.theForm);
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
