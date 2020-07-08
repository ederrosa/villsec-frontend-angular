import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, OnDestroy, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent, MatPaginator } from '@angular/material/paginator';

import Swiper from 'swiper';
import { Subscription, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { IVideoDTO } from 'src/app/shared/models/dtos/ivideo-dto';
import { VideoService } from '../video.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SwiperService } from 'src/app/core/services/swiper.service';

@Component({
  selector: 'app-video-cube-dialog-overview',
  templateUrl: './video-cube-dialog-overview.component.html',
  styleUrls: ['./video-cube-dialog-overview.component.scss']
})
export class VideoCubeDialogOverviewComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() galeriaID: number;
  private theVideoCubeDialogOverviewSwiper: Swiper;
  private theInscricao: Subscription[] = new Array<Subscription>();
  private theObservable: Observable<any>;
  dataSource: MatTableDataSource<IVideoDTO> = new MatTableDataSource();
  pageEvent: PageEvent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private theVideoService: VideoService,
    public dialogRef: MatDialogRef<VideoCubeDialogOverviewComponent>,
    private theSwiperService: SwiperService,
    private theUnsubscribeControl: UnsubscribeControlService
  ) {

  }

  getTheObservable(): any {
    return this.theObservable;
  }

  ngAfterViewInit() {
    this.theInscricao.push(this.theVideoService.findPage(
      0,
      12,
      'dtUltimaAlteracao',
      'DESC',
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
    this.theVideoCubeDialogOverviewSwiper = this.theSwiperService
      .getSwiperCube(
        "swiper-video-cube-dialog-overview",
        'horizontal'
      );
    this.theVideoCubeDialogOverviewSwiper.update();
  }

  ngOnDestroy() {
    this.theUnsubscribeControl.unsubscribe(this.theInscricao);
    this.dataSource.disconnect();
    this.dataSource = null;
    this.theVideoCubeDialogOverviewSwiper.destroy(true, true);
    this.theVideoCubeDialogOverviewSwiper = null;
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.changeDetectorRef.detectChanges();
  }

  onLoadPage() {
    this.theInscricao.push(this.theVideoService.findPage(
      0,
      12,
      'dtUltimaAlteracao',
      'DESC',
      this.galeriaID).subscribe(
        (x => {
          this.dataSource = new MatTableDataSource(x['content']);
          this.theObservable = this.dataSource.connect();
        })
      )
    );
    this.theVideoCubeDialogOverviewSwiper.update();
  }
}
