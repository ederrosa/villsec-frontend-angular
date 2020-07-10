import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SixthBannerComponent } from './sixth-banner.component';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { ProprietarioModule } from '../../proprietario/proprietario.module';

@NgModule({
  declarations: [SixthBannerComponent],
  imports: [
    CommonModule,
    MaterialModule,    
    PipesModule,
    ProprietarioModule,
    RouterModule,
  ],
  exports: [
    SixthBannerComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SixthBannerModule { }
