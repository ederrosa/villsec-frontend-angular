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
import { AlbumService } from '../album.service';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { ConfirmationAlertComponent } from 'src/app/shared/components/alerts/confirmation-alert/confirmation-alert.component';
import { InformativeAlertComponent } from 'src/app/shared/components/alerts/informative-alert/informative-alert.component';
import { IAlbumDTO } from 'src/app/shared/models/dtos/ialbum-dto';

@Component({
  selector: 'app-album-find-page',
  templateUrl: './album-find-page.component.html',
  styleUrls: ['./album-find-page.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AlbumFindPageComponent implements OnInit, OnDestroy, AfterViewInit {

  private delete: boolean;
  private insert: boolean;
  private theInscricao: Subscription[] = new Array<Subscription>();
  private theLocalUser: ILocalUser;
  private update: boolean;

  columnsToDisplay = ['codigo', 'nome', 'genero'];
  dataSource: MatTableDataSource<IAlbumDTO> = new MatTableDataSource();
  expandedElement: IAlbumDTO | null;
  pageEvent: PageEvent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private theActivatedRoute: ActivatedRoute,
    private theAlbumService: AlbumService,
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
    this.theInscricao.push(this.theAlbumService.findPage().subscribe(
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isDelete(): boolean {
    return this.delete;
  }

  isInsert(): boolean {
    return this.insert;
  }

  isUpdate(): boolean {
    return this.update;
  }

  ngAfterViewInit() {
    this.theInscricao.push(this.paginator.page
      .pipe(
        tap(() => this.onLoadPage())
      ).subscribe());
  }

  ngOnDestroy() {
    this.dataSource = null;
    this.expandedElement = null;
    if (this.theInscricao.length > 0) {
      this.theUnsubscribeControl.unsubscribe(this.theInscricao);
    }
    this.theInscricao = null;
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onDelete(theIAlbumDTO: IAlbumDTO) {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(ConfirmationAlertComponent, { disableClose: true, width: '40%' });
    let instance = dialogRef.componentInstance;
    instance.title = 'Você deseja realmente deletar esse registro??';
    instance.subTitle = 'Confirma a remoção?';
    instance.classCss = 'color-danger';
    this.theInscricao.push(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.theInscricao.push(this.theAlbumService.delete(theIAlbumDTO.id)
          .subscribe((event: HttpEvent<Object>) => {
            if (event.type == HttpEventType.Response) {
              this.dialog.closeAll();
              let dialogRef = this.dialog.open(InformativeAlertComponent, { disableClose: true, width: '40%' });
              let instance = dialogRef.componentInstance;
              instance.title = "Status: " + event.status;
              instance.subTitle = 'Deletando!...';
              instance.classCss = 'color-success';
              instance.message = event.statusText + '!! O Album foi Deletado com sucesso!';
              instance.urlNavigate = '/albuns';
              this.theRouter.navigate(['/']);
            }
          }, error => {

          }));
      }
    }));
  }

  onLoadPage() {
    this.theInscricao.push(this.theAlbumService.findPage(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      'nome',
      'ASC'
    ).subscribe(
      (x => {
        this.dataSource = new MatTableDataSource(x['content']);
      })
    ));
  }

  onUpdate(theIAlbumDTO: IAlbumDTO) {
    this.theAlbumService.setIAlbumDTO(theIAlbumDTO);
    this.theRouter.navigate(
      ['editar', theIAlbumDTO.id],
      { relativeTo: this.theActivatedRoute }
    );
  }
}
