import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { GaleriaRoutingModule } from './galeria-routing.module';
import { GaleriaService } from './galeria.service';
import { GaleriaFindPageModule } from './galeria-find-page/galeria-find-page.module';
import { GaleriaInsertModule } from './galeria-insert/galeria-insert.module';
import { GaleriaTableModule } from './galeria-table/galeria-table.module';
import { GaleriaUpdateModule } from './galeria-update/galeria-update.module';

const MODULES_LIST = [
  GaleriaFindPageModule,
  GaleriaInsertModule,
  GaleriaTableModule,
  GaleriaUpdateModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    GaleriaRoutingModule,
    ...MODULES_LIST
  ],
  exports: [
    ...MODULES_LIST
  ],
  providers: [
    GaleriaService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class GaleriaModule { }
