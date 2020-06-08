import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SeguidorRoutingModule } from './seguidor-routing.module';
import { ErrorModule } from '../error/error.module';
import { SeguidorService } from './seguidor.service';
import { SeguidorFindPageModule } from './seguidor-find-page/seguidor-find-page.module';
import { SeguidorInsertModule } from './seguidor-insert/seguidor-insert.module';
import { SeguidorUpdateModule } from './seguidor-update/seguidor-update.module';

const SEGUIDOR_MODULES_LIST = [
  SeguidorFindPageModule,
  SeguidorInsertModule,
  SeguidorUpdateModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ErrorModule,
    SeguidorRoutingModule,
    ...SEGUIDOR_MODULES_LIST,
    RouterModule,
  ],
  exports: [
    ...SEGUIDOR_MODULES_LIST,
  ],
  providers: [
    SeguidorService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SeguidorModule { }
