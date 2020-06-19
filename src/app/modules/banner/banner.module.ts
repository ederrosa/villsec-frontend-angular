import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FirstBannerModule } from './first-banner/first-banner.module';
import { SecondBannerModule } from './second-banner/second-banner.module';
import { ThirdBannerModule } from './third-banner/third-banner.module';
import { FourthBannerModule } from './fourth-banner/fourth-banner.module';
import { FifthBannerModule } from './fifth-banner/fifth-banner.module';
import { SixthBannerModule } from './sixth-banner/sixth-banner.module';

const MODULES_LIST = [
  FirstBannerModule,
  SecondBannerModule,
  ThirdBannerModule,
  FourthBannerModule,
  FifthBannerModule,
  SixthBannerModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    ...MODULES_LIST
  ],
  exports: [
    ...MODULES_LIST
  ],
  providers: [

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class BannerModule { }
