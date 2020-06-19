import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FourthBannerComponent } from './fourth-banner.component';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [FourthBannerComponent],
  imports: [
    CommonModule,
    MaterialModule,
    PipesModule,
    RouterModule,
  ],
  exports: [
    FourthBannerComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class FourthBannerModule { }
