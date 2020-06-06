import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProprietarioRoutingModule } from './proprietario-routing.module';
import { ErrorModule } from '../error/error.module';
import { ProprietarioService } from './proprietario.service';
import { ProprietarioFindPageModule } from './proprietario-find-page/proprietario-find-page.module';
import { ProprietarioInsertModule } from './proprietario-insert/proprietario-insert.module';
import { ProprietarioUpdateModule } from './proprietario-update/proprietario-update.module';

const PROPRIETARIOS_MODULES_LIST = [
  ProprietarioFindPageModule,
  ProprietarioInsertModule,
  ProprietarioUpdateModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ErrorModule,
    ProprietarioRoutingModule,
    ...PROPRIETARIOS_MODULES_LIST,
    RouterModule,
  ],
  exports: [
    ...PROPRIETARIOS_MODULES_LIST,
  ],
  providers: [
    ProprietarioService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ProprietarioModule { }
