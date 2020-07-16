import { Injectable } from '@angular/core';

// Import Swiper and modules
import { Swiper, Autoplay, EffectCoverflow, EffectCube, Keyboard,  Navigation } from 'swiper/js/swiper.esm.js';

// Install modules
Swiper.use(
  [
    Autoplay,
    EffectCoverflow,
    EffectCube,    
    Keyboard,
    Navigation
  ]);

@Injectable({
  providedIn: 'root'
})
export class SwiperService {

  constructor() { }

  getSwiperCoverflow(theClass: string, theDirection: string): Swiper {
    return new Swiper(`.${theClass}`, {
      effect: 'coverflow',
      direction: theDirection,
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
      },
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
    });
  }

  getSwiperCube(theClass: string, theDirection: string): Swiper {
    return new Swiper(`.${theClass}`, {
      effect: 'cube',
      direction: theDirection,
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
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
    });
  }
}
