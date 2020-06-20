import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { Subscription, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import Swiper from 'swiper';

import { IAlbumDTO } from 'src/app/shared/models/dtos/ialbum-dto';
import { AlbumService } from '../../album/album.service';
import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';

@Component({
  selector: 'app-second-banner',
  templateUrl: './second-banner.component.html',
  styleUrls: ['./second-banner.component.scss']
})
export class SecondBannerComponent implements OnInit, OnDestroy, AfterViewInit {

  private mySwiper: Swiper;
  private theInscricao: Subscription[] = new Array<Subscription>();
  theObservable: Observable<any>;

  dataSource: MatTableDataSource<IAlbumDTO> = new MatTableDataSource();
  pageEvent: PageEvent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private theAlbumService: AlbumService,
    private changeDetectorRef: ChangeDetectorRef,
    private theUnsubscribeControl: UnsubscribeControlService

  ) {
    this.theInscricao.push(this.theAlbumService.findPage().subscribe(
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

  ngAfterViewInit() {
    this.theInscricao.push(this.paginator.page
      .pipe(
        tap(() => this.onLoadPage())
      ).subscribe());
    this.mySwiper = this.onSwiperBuild();
  }

  ngOnDestroy() {
    this.theUnsubscribeControl.unsubscribe(this.theInscricao);
    this.mySwiper = null;
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.changeDetectorRef.detectChanges();
  }

  onLoadPage() {
    this.theInscricao.push(this.theAlbumService.findPage(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      'ano',
      'ASC'
    ).subscribe(
      (x => {
        this.dataSource = new MatTableDataSource(x['content']);
        this.theObservable = this.dataSource.connect();
      })
    ));

  }

  private onSwiperBuild(): Swiper {
    return new Swiper('.swiper-container', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      observer: true,
      observerParents: true,
      observeSlideChildren: true,
      slidesPerView: 'auto',
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
      pagination: {
        el: '.swiper-pagination',
      },
    });
  }
}
