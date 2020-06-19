import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DefaultComponent } from './default.component';
import { MaterialModule } from '../../configurations/material/material.module';
import { BannerModule } from 'src/app/modules/banner/banner.module';

@NgModule({
  declarations: [DefaultComponent],
  imports: [
    CommonModule,
    BannerModule,
    MaterialModule,
    RouterModule,    
  ],
  exports: [
    DefaultComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class DefaultModule { }
