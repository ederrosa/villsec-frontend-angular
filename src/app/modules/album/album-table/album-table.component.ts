import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ILocalUser } from 'src/app/shared/models/domain/ilocal-user';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { IAlbumDTO } from 'src/app/shared/models/dtos/ialbum-dto';
import { AlbumService } from '../album.service';

@Component({
  selector: 'app-album-table',
  templateUrl: './album-table.component.html',
  styleUrls: ['./album-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AlbumTableComponent implements OnInit, OnDestroy, AfterViewInit {

  private insert: boolean;
  private theLocalUser: ILocalUser;
  private theInscricao: Subscription[] = new Array<Subscription>();
  dataSource: MatTableDataSource<IAlbumDTO> = new MatTableDataSource();
  columnsToDisplay = ['codigo', 'nome', 'genero'];
  expandedElement: IAlbumDTO | null;
  pageEvent: PageEvent;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private theAlbumService: AlbumService,
    private theUnsubscribeControl: UnsubscribeControlService
  ) {
    if (sessionStorage['localUser'] != null) {
      this.theLocalUser = JSON.parse(sessionStorage.getItem('localUser')) as ILocalUser;
      switch (this.theLocalUser.theTipoUsuario) {
        case 1:
          this.insert = true;
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

  getInsert(): boolean {
    return this.insert;
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
    this.theUnsubscribeControl.unsubscribe(this.theInscricao);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  onSelected(theIAlbumDTO: IAlbumDTO): void {
    this.theAlbumService.setIAlbumDTO(theIAlbumDTO);
  }
}
