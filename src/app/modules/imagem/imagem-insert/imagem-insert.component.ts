import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpEventType, HttpEvent } from '@angular/common/http';

import { Subscription } from 'rxjs';
import { ImagemService } from '../imagem.service';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { ProgressSpinnerOverviewComponent } from 'src/app/shared/components/progress-spinner/progress-spinner-overview/progress-spinner-overview.component';
import { InformativeAlertComponent } from 'src/app/shared/components/alerts/informative-alert/informative-alert.component';
import { GaleriaService } from '../../galeria/galeria.service';

@Component({
  selector: 'app-imagem-insert',
  templateUrl: './imagem-insert.component.html',
  styleUrls: ['./imagem-insert.component.scss']
})
export class ImagemInsertComponent implements OnInit, OnDestroy, AfterViewInit {

  private format: string;
  private linear: boolean = true;
  private theGaleriaForm: FormGroup;
  private theForm: FormGroup; 
  private theFile: File;
  private theInscricao: Subscription[] = new Array<Subscription>();
  private url: any;

  constructor(
    private dialog: MatDialog,
    private theGaleriaService: GaleriaService,
    private theFormBuilder: FormBuilder,    
    private theImagemService: ImagemService,
    private theUnsubscribeControl: UnsubscribeControlService,
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
    this.theForm = null;
    this.theGaleriaForm = null;
    this.theInscricao = null;   
  }
   
  ngOnInit() {
    this.theForm = this.theFormBuilder.group({
      descricao: ['', [Validators.required]],
      titulo: ['', [Validators.required]],
    });
    this.theGaleriaForm = this.theFormBuilder.group({
      theGaleriaID: ['', [Validators.required]]
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
      if (this.getTheFile().type.indexOf('image') > -1) {
        this.format = 'image';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      }
    }
  }

  onSave() {
    let formData: FormData = new FormData();
    formData.append('descricao', this.getTheForm().get('descricao').value);
    formData.append('titulo', this.getTheForm().get('titulo').value);
    if (this.getTheFile()) {
      formData.append('file', this.getTheFile(), this.getTheFile().name);
    }
    formData.append('galeriaID', this.getTheGaleriaForm().get('theGaleriaID').value);
    let dialogRef = this.dialog.open(ProgressSpinnerOverviewComponent, { disableClose: true, width: '350px', height: '350px' });
    this.theInscricao.push(this.theImagemService.insert(formData)
      .subscribe((event: HttpEvent<Object>) => {
        if (event.type === HttpEventType.Response) {
          this.dialog.closeAll();
          let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
          let instance = dialogRef.componentInstance;
          instance.title = "Status: " + event.status;
          instance.subTitle = 'OK!...';
          instance.classCss = 'color-success';
          instance.message = event.statusText + '!! A nova imagem foi armazenada com sucesso!';
          this.onClear();
          FormData = null;
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
