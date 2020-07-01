import { Injectable } from '@angular/core';

import Swiper from 'swiper';

@Injectable({
  providedIn: 'root'
})
export class SwiperService {

  constructor() { }

  getSwiperCoverflow(): Swiper {
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
        slideShadows: false,
      }
    });
  }

  getSwiperCube(): Swiper {
    return new Swiper('.swiper-container', {
      effect: 'cube',
      grabCursor: true,
      observer: true,
      observerParents: true,
      observeSlideChildren: true,
      cubeEffect: {
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94,
      },
      pagination: {
        el: '.swiper-pagination',
      },
    });
  }
}
