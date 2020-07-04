import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ImagemFindPageComponent } from './imagem-find-page.component';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';
import { GaleriaModule } from '../../galeria/galeria.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ImagemFindPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RouterModule,
    GaleriaModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    ImagemFindPageComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ImagemFindPageModule { }
