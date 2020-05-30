import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ILocalUser } from 'src/app/shared/models/domain/ilocal-user';
import { IElementoDTO } from 'src/app/shared/models/dtos/ielemento-dto';
import { ElementoService } from '../elemento.service';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { ConfirmationAlertComponent } from 'src/app/shared/components/alerts/confirmation-alert/confirmation-alert.component';
import { InformativeAlertComponent } from 'src/app/shared/components/alerts/informative-alert/informative-alert.component';
import { DialogOverviewImageComponent } from 'src/app/shared/components/dialog-overview/dialog-overview-image/dialog-overview-image.component';
import { DialogOverviewAudioComponent } from 'src/app/shared/components/dialog-overview/dialog-overview-audio/dialog-overview-audio.component';
import { DialogOverviewVideoComponent } from 'src/app/shared/components/dialog-overview/dialog-overview-video/dialog-overview-video.component';
import { DialogOverviewIframeComponent } from 'src/app/shared/components/dialog-overview/dialog-overview-iframe/dialog-overview-iframe.component';

@Component({
  selector: 'app-elemento-find-page',
  templateUrl: './elemento-find-page.component.html',
  styleUrls: ['./elemento-find-page.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ElementoFindPageComponent implements OnInit, OnDestroy, AfterViewInit {

  disabledNew: boolean = true;
  disabledEdit: boolean = true;
  disabledDel: boolean = true;
  private theLocalUser: ILocalUser;
  private theInscricao: Subscription[] = new Array<Subscription>();
  dataSource: MatTableDataSource<IElementoDTO> = new MatTableDataSource();
  columnsToDisplay = ['titulo', 'tipoElemento'];
  expandedElement: IElementoDTO | null;
  pageEvent: PageEvent;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private theActivatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private theElementoService: ElementoService,
    private theRouter: Router,
    private theUnsubscribeControl: UnsubscribeControlService
  ) {
    if (sessionStorage['localUser'] != null) {
      this.theLocalUser = JSON.parse(sessionStorage.getItem('localUser')) as ILocalUser;
      switch (this.theLocalUser.theTipoUsuario) {
        case 1:
          this.disabledDel = false;
          this.disabledEdit = false;
          this.disabledNew = false;
          break;
        case 2:
          this.disabledDel = false;
          this.disabledEdit = true;
          this.disabledNew = false;
          break;
      }
    }
    this.theInscricao.push(this.theElementoService.findPage().subscribe(
      (x => {
        this.paginator.pageSizeOptions = [12, 24, 48, 100];
        this.paginator.length = x['totalElements'];
        this.paginator.showFirstLastButtons = true;
        this.paginator.pageSize = x['size'];
        this.paginator.pageIndex = x['number'];
        this.dataSource = new MatTableDataSource(x['content']);
      })
    ));
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.dataSource = null;
    this.expandedElement = null;
    this.theUnsubscribeControl.unsubscribe(this.theInscricao);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  delete(theIElementoDTO: IElementoDTO) {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(ConfirmationAlertComponent, { disableClose: true, width: '40%' });
    let instance = dialogRef.componentInstance;
    instance.title = 'Você deseja realmente deletar esse registro??';
    instance.subTitle = 'Confirma a remoção?';
    instance.classCss = 'color-danger';
    this.theInscricao.push(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.theInscricao.push(this.theElementoService.delete(theIElementoDTO.id)
          .subscribe((event: HttpEvent<Object>) => {
            if (event.type == HttpEventType.Response) {
              this.dialog.closeAll();
              let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
              let instance = dialogRef.componentInstance;
              instance.title = "Status: " + event.status;
              instance.subTitle = 'Deletando!...';
              instance.classCss = 'color-success';
              instance.message = event.statusText + '!! O Arquivo foi Deletado com sucesso!';
              instance.urlNavigate = '/elementos';
              this.theRouter.navigate(['/']);
            }
          }, error => {

          }));
      }
    }));
  }

  update(theIElementoDTO: IElementoDTO) {
    this.theElementoService.setIElementoDTO(theIElementoDTO);
    this.theRouter.navigate(
      ['editar', theIElementoDTO.id],
      { relativeTo: this.theActivatedRoute }
    );
  }

  ngAfterViewInit() {
    this.theInscricao.push(this.paginator.page
      .pipe(
        tap(() => this.loadPage())
      ).subscribe());
  }

  loadPage() {
    this.theInscricao.push(this.theElementoService.findPage(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      'titulo',
      'ASC'
    ).subscribe(
      (x => {
        this.dataSource = new MatTableDataSource(x['content']);
      })
    ));
  }

  openDialogAudio(theIElementoDTO: IElementoDTO): void {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(DialogOverviewAudioComponent, { });
    let instance = dialogRef.componentInstance;
    instance.title = theIElementoDTO.titulo;
    instance.subtitle = theIElementoDTO.descricao;
    instance.url = theIElementoDTO.elementoUrl;
  }

  openDialogImage(theIElementoDTO: IElementoDTO): void {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(DialogOverviewImageComponent, { });
    let instance = dialogRef.componentInstance;
    instance.title = theIElementoDTO.titulo;
    instance.subtitle = theIElementoDTO.descricao;
    instance.url = theIElementoDTO.elementoUrl;
  }

  openDialogVideo(theIElementoDTO: IElementoDTO): void {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(DialogOverviewVideoComponent, { });
    let instance = dialogRef.componentInstance;
    instance.title = theIElementoDTO.titulo;
    instance.subtitle = theIElementoDTO.descricao;
    instance.url = theIElementoDTO.elementoUrl;
  }

  openDialogIframe(theIElementoDTO: IElementoDTO): void {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(DialogOverviewIframeComponent, { });
    let instance = dialogRef.componentInstance;
    instance.title = theIElementoDTO.titulo;
    instance.subtitle = theIElementoDTO.descricao;
    instance.url = theIElementoDTO.embed;
  }
}
