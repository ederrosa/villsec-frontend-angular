import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElementoRoutingModule } from './elemento-routing.module';
import { ElementoFindPageModule } from './elemento-find-page/elemento-find-page.module';
import { ElementoInsertModule } from './elemento-insert/elemento-insert.module';
import { ElementoUpdateModule } from './elemento-update/elemento-update.module';
import { RouterModule } from '@angular/router';
import { ElementoService } from './elemento.service';

const MODULES_LIST = [
    ElementoFindPageModule,
    ElementoInsertModule,
    ElementoUpdateModule,
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    ElementoRoutingModule,
    ...MODULES_LIST
  ],
  exports: [
    ...MODULES_LIST
  ],
  providers: [
    ElementoService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ElementoModule { }
