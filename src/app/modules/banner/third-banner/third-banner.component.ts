import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import { tap } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';

import Swiper from 'swiper';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { IEventoDTO } from 'src/app/shared/models/dtos/ievento-dto';
import { DialogOverviewImageComponent } from 'src/app/shared/components/dialog-overview/dialog-overview-image/dialog-overview-image.component';
import { EventoService } from '../../evento/evento.service';
import { SwiperService } from 'src/app/core/services/swiper.service';
import { DialogOverviewIframeComponent } from 'src/app/shared/components/dialog-overview/dialog-overview-iframe/dialog-overview-iframe.component';


@Component({
  selector: 'app-third-banner',
  templateUrl: './third-banner.component.html',
  styleUrls: ['./third-banner.component.scss']
})
export class ThirdBannerComponent implements OnInit, OnDestroy, AfterViewInit {

  private theThirdBannerSwiper: Swiper;
  private theInscricao: Subscription[] = new Array<Subscription>();
  private theObservable: Observable<any>;
  dataSource: MatTableDataSource<IEventoDTO> = new MatTableDataSource();
  pageEvent: PageEvent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private theEventoService: EventoService,
    private changeDetectorRef: ChangeDetectorRef,
    private theSwiperService: SwiperService,
    private theUnsubscribeControl: UnsubscribeControlService
  ) {
    this.theInscricao.push(this.theEventoService.findPage().subscribe(
      (x => {
        this.paginator.pageSizeOptions = [12, 24, 48, 100];
        this.paginator.length = x['totalElements'];
        this.paginator.showFirstLastButtons = true;
        this.paginator.pageSize = x['size'];
        this.paginator.pageIndex = x['number'];
        this.dataSource = new MatTableDataSource(x['content']);
        this.theObservable = this.dataSource.connect();
      })
    ));
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getTheObservable(): any {
    return this.theObservable;
  }

  getMaps(theIEventoDTO: IEventoDTO) {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(DialogOverviewIframeComponent, {});
    let instance = dialogRef.componentInstance;
    instance.title = theIEventoDTO.nome;
    instance.subtitle = 'V1llsec';
    instance.url = theIEventoDTO.googleMapsUrl;
  }

  ngAfterViewInit() {
    this.theInscricao.push(this.paginator.page
      .pipe(
        tap(() => this.onLoadPage())
      ).subscribe());
    this.theThirdBannerSwiper = this.theSwiperService
      .getSwiperCoverflow(
        "swiper-thirdbanner",
        'horizontal'
      );
    this.theThirdBannerSwiper.update();
  }

  ngOnDestroy() {
    if (this.theInscricao.length > 0) {
      this.theUnsubscribeControl.unsubscribe(this.theInscricao);
    }
    this.dataSource.disconnect();
    this.dataSource = null;
    this.theThirdBannerSwiper.destroy(true, true);
    this.theThirdBannerSwiper = null;
    this.theInscricao = null;
    this.theObservable = null;
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.changeDetectorRef.detectChanges();
  }

  onLoadPage() {
    this.theInscricao.push(this.theEventoService.findPage(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      'diaInicio',
      'DESC'
    ).subscribe(
      (x => {
        this.dataSource = new MatTableDataSource(x['content']);
        this.theObservable = this.dataSource.connect();
      })
    ));
    this.theThirdBannerSwiper.update();
  }

  openDialogImage(theIEventoDTO: IEventoDTO): void {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(DialogOverviewImageComponent, {});
    let instance = dialogRef.componentInstance;
    instance.title = theIEventoDTO.nome;
    instance.subtitle = 'V1llsec';
    instance.url = theIEventoDTO.folderUrl;
  }
}
