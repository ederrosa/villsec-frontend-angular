import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ILocalUser } from 'src/app/shared/models/domain/ilocal-user';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { IGaleriaDTO } from 'src/app/shared/models/dtos/igaleria-dto';
import { GaleriaService } from '../galeria.service';

@Component({
  selector: 'app-galeria-table',
  templateUrl: './galeria-table.component.html',
  styleUrls: ['./galeria-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GaleriaTableComponent implements OnInit, OnDestroy, AfterViewInit {

  private insert: boolean;
  private theInscricao: Subscription[] = new Array<Subscription>();
  private theLocalUser: ILocalUser;

  columnsToDisplay = ['id','titulo'];
  dataSource: MatTableDataSource<IGaleriaDTO> = new MatTableDataSource();
  expandedElement: IGaleriaDTO | null;
  pageEvent: PageEvent;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private theGaleriaService: GaleriaService,
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
    this.theInscricao.push(this.theGaleriaService.findPage().subscribe(
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

  isInsert(): boolean {
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
    if (this.theInscricao.length > 0) {
      this.theUnsubscribeControl.unsubscribe(this.theInscricao);
    }
    this.theInscricao = null;    
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onLoadPage() {
    this.theInscricao.push(this.theGaleriaService.findPage(
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

  onSelected(theIGaleriaDTO: IGaleriaDTO): void {
    this.theGaleriaService.setIGaleriaDTO(theIGaleriaDTO);
  }
}
