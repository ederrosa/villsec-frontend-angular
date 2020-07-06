import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { ILocalUser } from 'src/app/shared/models/domain/ilocal-user';
import { IImagemDTO } from 'src/app/shared/models/dtos/iimagem-dto';
import { ImagemService } from '../imagem.service';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { ConfirmationAlertComponent } from 'src/app/shared/components/alerts/confirmation-alert/confirmation-alert.component';
import { InformativeAlertComponent } from 'src/app/shared/components/alerts/informative-alert/informative-alert.component';
import { GaleriaService } from '../../galeria/galeria.service';
import { DialogOverviewImageComponent } from 'src/app/shared/components/dialog-overview/dialog-overview-image/dialog-overview-image.component';

@Component({
  selector: 'app-imagem-find-page',
  templateUrl: './imagem-find-page.component.html',
  styleUrls: ['./imagem-find-page.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ImagemFindPageComponent implements OnInit, OnDestroy, AfterViewInit {

  private delete: boolean;
  private insert: boolean;
  private readonly linear: boolean = true;
  private theGaleriaForm: FormGroup;  
  private theInscricao: Subscription[] = new Array<Subscription>();
  private theLocalUser: ILocalUser;
  private update: boolean;

  dataSource: MatTableDataSource<IImagemDTO> = new MatTableDataSource();
  columnsToDisplay = ['id', 'titulo'];
  expandedElement: IImagemDTO | null;
  pageEvent: PageEvent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private theGaleriaService: GaleriaService,
    private theFormBuilder: FormBuilder,    
    private theImagemService: ImagemService,
    private theRouter: Router,
    private theUnsubscribeControl: UnsubscribeControlService
  ) {
    if (sessionStorage['localUser'] != null) {
      this.theLocalUser = JSON.parse(sessionStorage.getItem('localUser')) as ILocalUser;
      switch (this.theLocalUser.theTipoUsuario) {
        case 1:
          this.delete = true;
          this.insert = true;
          this.update = true;
          break;
        case 2:
          this.delete = true;
          this.insert = true;
          this.update = true;
          break;
      }
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getDelete(): boolean {
    return this.delete;
  }

  getInsert(): boolean {
    return this.insert;
  }

  getLinear(): boolean {
    return this.linear;
  }

  getTheGaleriaForm(): FormGroup {
    return this.theGaleriaForm;
  }

  getUpdate(): boolean {
    return this.update;
  }

  ngAfterViewInit() {
    this.theInscricao.push(this.theGaleriaService.eventEmitter.subscribe(
      theIGaleria => {
        this.getTheGaleriaForm().patchValue({
          theIGaleria: theIGaleria.id
        });
        this.theInscricao.push(this.theImagemService.findPage(
          0,
          12,
          'dtUltimaAlteracao',
          'ASC',
          theIGaleria.id).subscribe(
            (x => {
              this.paginator.pageSizeOptions = [12, 24, 48, 100];
              this.paginator.length = x['totalElements'];
              this.paginator.showFirstLastButtons = true;
              this.paginator.pageSize = x['size'];
              this.paginator.pageIndex = x['number'];
              this.paginator.pageIndex = x['number'];
              this.dataSource = new MatTableDataSource(x['content']);
            })
          )
        );
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    ));
    this.theInscricao.push(this.paginator.page
      .pipe(
        tap(() => this.onLoadPage())
      ).subscribe());
  }

  ngOnDestroy() {
    this.dataSource = null;
    this.expandedElement = null;
    this.theUnsubscribeControl.unsubscribe(this.theInscricao);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.theGaleriaForm = this.theFormBuilder.group({
      theIGaleria: ['', [Validators.required]]
    });
  }

  onDelete(theIImagemDTO: IImagemDTO) {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(ConfirmationAlertComponent, { disableClose: true, width: '40%' });
    let instance = dialogRef.componentInstance;
    instance.title = 'Você deseja realmente deletar esse registro??';
    instance.subTitle = 'Confirma a remoção?';
    instance.classCss = 'color-danger';
    this.theInscricao.push(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.theInscricao.push(this.theImagemService.delete(theIImagemDTO.id)
          .subscribe((event: HttpEvent<Object>) => {
            if (event.type == HttpEventType.Response) {
              this.dialog.closeAll();
              let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
              let instance = dialogRef.componentInstance;
              instance.title = "Status: " + event.status;
              instance.subTitle = 'Deletando!...';
              instance.classCss = 'color-success';
              instance.message = event.statusText + '!! A Foto foi deletada com sucesso!';
              instance.urlNavigate = '/imagens';
              this.theRouter.navigate(['/']);
            }
          }, error => {

          }));
      }
    }));
  }

  onLoadPage() {
    this.theInscricao.push(this.theImagemService.findPage(
      0,
      12,
      'dtUltimaAlteracao',
      'ASC',
      this.getTheGaleriaForm().get('theIGaleria').value).subscribe(
        (x => {
          this.dataSource = new MatTableDataSource(x['content']);
        })
      )
    );
  } 

  onUpdate(theIImagemDTO: IImagemDTO) {
    this.theImagemService.setIImagemDTO(theIImagemDTO);
    this.theRouter.navigate(
      ['imagens/editar', theIImagemDTO.id]
    );
  }

  openDialogImage(theIImagemDTO: IImagemDTO): void {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(DialogOverviewImageComponent, {});
    let instance = dialogRef.componentInstance;
    instance.title = theIImagemDTO.titulo;
    instance.subtitle = theIImagemDTO.descricao;
    instance.url = theIImagemDTO.arquivoUrl;
  }  
}
