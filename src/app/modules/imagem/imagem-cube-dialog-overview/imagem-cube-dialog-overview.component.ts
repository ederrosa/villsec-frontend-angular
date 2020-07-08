import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, OnDestroy, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent, MatPaginator } from '@angular/material/paginator';

import Swiper from 'swiper';
import { Subscription, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { IImagemDTO } from 'src/app/shared/models/dtos/iimagem-dto';
import { ImagemService } from '../imagem.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SwiperService } from 'src/app/core/services/swiper.service';

@Component({
  selector: 'app-imagem-cube-dialog-overview',
  templateUrl: './imagem-cube-dialog-overview.component.html',
  styleUrls: ['./imagem-cube-dialog-overview.component.scss']
})
export class ImagemCubeDialogOverviewComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() galeriaID: number;
  private theImagemCubeDialogOverviewSwiper: Swiper;
  private theInscricao: Subscription[] = new Array<Subscription>();
  private theObservable: Observable<any>;
  dataSource: MatTableDataSource<IImagemDTO> = new MatTableDataSource();
  pageEvent: PageEvent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private theImagemService: ImagemService,
    public dialogRef: MatDialogRef<ImagemCubeDialogOverviewComponent>,
    private theSwiperService: SwiperService,
    private theUnsubscribeControl: UnsubscribeControlService
  ) {

  }

  getTheObservable(): any {
    return this.theObservable;
  }

  ngAfterViewInit() {
    this.theInscricao.push(this.theImagemService.findPage(
      0,
      12,
      'titulo',
      'ASC',
      this.galeriaID).subscribe(
        (x => {
          this.paginator.pageSizeOptions = [12, 24, 48, 100];
          this.paginator.length = x['totalElements'];
          this.paginator.showFirstLastButtons = true;
          this.paginator.pageSize = x['size'];
          this.paginator.pageIndex = x['number'];
          this.paginator.pageIndex = x['number'];
          this.dataSource = new MatTableDataSource(x['content']);
          this.theObservable = this.dataSource.connect();
        })
      )
    );
    this.dataSource.paginator = this.paginator;
    this.theInscricao.push(this.paginator.page
      .pipe(
        tap(() => this.onLoadPage())
      ).subscribe());
    this.theImagemCubeDialogOverviewSwiper = this.theSwiperService
      .getSwiperCube(
        "swiper-imagem-cube-dialog-overview",
        'horizontal'
      );
    this.theImagemCubeDialogOverviewSwiper.update();
  }

  ngOnDestroy() {
    this.theUnsubscribeControl.unsubscribe(this.theInscricao);
    this.dataSource.disconnect();
    this.dataSource = null;   
    this.theImagemCubeDialogOverviewSwiper.destroy(true, true);
    this.theImagemCubeDialogOverviewSwiper = null;
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.changeDetectorRef.detectChanges();
  }

  onLoadPage() {
    this.theInscricao.push(this.theImagemService.findPage(
      0,
      12,
      'titulo',
      'ASC',
      this.galeriaID).subscribe(
        (x => {
          this.dataSource = new MatTableDataSource(x['content']);
          this.theObservable = this.dataSource.connect();
        })
      )
    );
    this.theImagemCubeDialogOverviewSwiper.update();
  }
}
