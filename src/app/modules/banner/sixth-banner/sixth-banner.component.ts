import { Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';

import Swiper from 'swiper';
import { Subscription, Observable } from 'rxjs';

import { UnsubscribeControlService } from 'src/app/core/services/unsubscribe-control.service';
import { SwiperService } from 'src/app/core/services/swiper.service';
import { ProprietarioService } from '../../proprietario/proprietario.service';
import { IProprietarioDTO } from 'src/app/shared/models/dtos/iproprietario-dto';
import { API_CONFIGURATION } from 'src/configurations/api.configuration';

@Component({
  selector: 'app-sixth-banner',
  templateUrl: './sixth-banner.component.html',
  styleUrls: ['./sixth-banner.component.scss']
})
export class SixthBannerComponent implements OnInit, OnDestroy, AfterViewInit {

  private theFooterSwiper: Swiper;
  private theInscricao: Subscription[] = new Array<Subscription>();
  private theIProprietarioDTO: IProprietarioDTO;

  constructor(
    private theProprietarioServices: ProprietarioService,
    private theSwiperService: SwiperService,
    private theUnsubscribeControl: UnsubscribeControlService) {    
  }

  getIProprietarioDTO(): IProprietarioDTO {
    return this.theIProprietarioDTO;
  }

  ngAfterViewInit() {   
    this.theFooterSwiper = this.theSwiperService
      .getSwiperCube(
        "swiper-footer",
        'vertical'
      );
    this.theFooterSwiper.update();
    //  this.theFooterSwiper.autoplay.start();
  }

  ngOnDestroy() {
    if (this.theInscricao.length > 0) {
      this.theUnsubscribeControl.unsubscribe(this.theInscricao);
    }    
    this.theFooterSwiper.destroy(true, true);
    this.theFooterSwiper = null;
    this.theInscricao = null;
  }

  ngOnInit() {
    this.theInscricao.push(this.theProprietarioServices.find(API_CONFIGURATION.proprietarioID)
      .subscribe(theIProprietarioDTO => { this.theIProprietarioDTO = theIProprietarioDTO }));
  }
}
