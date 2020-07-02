import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';
import { VideoUpdateComponent } from './video-update.component';
import { GaleriaModule } from '../../galeria/galeria.module';



@NgModule({
  declarations: [VideoUpdateComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    GaleriaModule,
    RouterModule,
    SharedModule,
  ],
  exports: [
    VideoUpdateComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class VideoUpdateModule { }
