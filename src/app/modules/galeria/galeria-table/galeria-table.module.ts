import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { GaleriaTableComponent } from './galeria-table.component';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';

@NgModule({
  declarations: [GaleriaTableComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  exports: [
    GaleriaTableComponent
  ]
})
export class GaleriaTableModule { }
