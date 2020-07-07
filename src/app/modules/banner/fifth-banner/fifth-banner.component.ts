import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { IGaleriaDTO } from 'src/app/shared/models/dtos/igaleria-dto';
import { GaleriaService } from '../../galeria/galeria.service';
import { MatDialog } from '@angular/material/dialog';
import { VideoCubeDialogOverviewComponent } from '../../video/video-cube-dialog-overview/video-cube-dialog-overview.component';


@Component({
  selector: 'app-fifth-banner',
  templateUrl: './fifth-banner.component.html',
  styleUrls: ['./fifth-banner.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FifthBannerComponent implements OnInit, OnDestroy, AfterViewInit {

  private theInscricao: Subscription[] = new Array<Subscription>();
  columnsToDisplay = ['titulo', 'descricao'];
  dataSource: MatTableDataSource<IGaleriaDTO> = new MatTableDataSource();
  expandedElement: IGaleriaDTO | null;
  pageEvent: PageEvent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private theGaleriaService: GaleriaService,
    private theUnsubscribeControl: UnsubscribeControlService
  ) {
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
  }

  onLoadPage() {
    this.theInscricao.push(this.theGaleriaService.findPage(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      'dtUltimaAlteracao',
      'DESC'
    ).subscribe(
      (x => {
        this.dataSource = new MatTableDataSource(x['content']);
      })
    ));
  }

  onSelected(theIGaleriaDTO: IGaleriaDTO): void {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(VideoCubeDialogOverviewComponent, {});
    let instance = dialogRef.componentInstance;
    instance.galeriaID = theIGaleriaDTO.id;
  }
}
