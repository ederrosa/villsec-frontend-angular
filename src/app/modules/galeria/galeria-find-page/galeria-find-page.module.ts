import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { GaleriaFindPageComponent } from './galeria-find-page.component';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';



@NgModule({
  declarations: [GaleriaFindPageComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    GaleriaFindPageComponent
  ]
})
export class GaleriaFindPageModule { }
