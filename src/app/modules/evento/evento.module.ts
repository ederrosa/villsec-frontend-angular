import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EventoRoutingModule } from './evento-routing.module';
import { EventoService } from './evento.service';
import { EventoFindPageModule } from './evento-find-page/evento-find-page.module';
import { EventoInsertModule } from './evento-insert/evento-insert.module';
import { EventoUpdateModule } from './evento-update/evento-update.module';

const MODULES_LIST = [
  EventoFindPageModule,
  EventoInsertModule,
  EventoUpdateModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    EventoRoutingModule,
    ...MODULES_LIST
  ],
  exports: [
    ...MODULES_LIST
  ],
  providers: [
    EventoService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class EventoModule { }
