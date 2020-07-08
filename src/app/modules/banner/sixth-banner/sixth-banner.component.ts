import { Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';

import Swiper from 'swiper';
import { Subscription, Observable } from 'rxjs';

import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { SwiperService } from 'src/app/core/services/swiper.service';

@Component({
  selector: 'app-sixth-banner',
  templateUrl: './sixth-banner.component.html',
  styleUrls: ['./sixth-banner.component.scss']
})
export class SixthBannerComponent implements OnInit, OnDestroy, AfterViewInit {

  private theFooterSwiper: Swiper;
  private theInscricao: Subscription[] = new Array<Subscription>();

  constructor(
    private theSwiperService: SwiperService,
    private theUnsubscribeControl: UnsubscribeControlService) { }

  ngAfterViewInit() {    
    this.theFooterSwiper = this.theSwiperService
      .getSwiperCube(
        "swiper-footer",
        'vertical'
      );
    this.theFooterSwiper.update();
    this.theFooterSwiper.autoplay.start();
  }

  ngOnDestroy() {
    this.theUnsubscribeControl.unsubscribe(this.theInscricao);
    this.theFooterSwiper.destroy(true, true);
    this.theFooterSwiper = null;
  }

  ngOnInit() {    
  }
}
