import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MusicaRoutingModule } from './musica-routing.module';
import { RouterModule } from '@angular/router';
import { MusicaService } from './musica.service';
import { MusicaFindPageModule } from './musica-find-page/musica-find-page.module';
import { MusicaInsertModule } from './musica-insert/musica-insert.module';
import { MusicaUpdateModule } from './musica-update/musica-update.module';

const MODULES_LIST = [
  MusicaFindPageModule,
  MusicaInsertModule,
  MusicaUpdateModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    MusicaRoutingModule,
    ...MODULES_LIST
  ],
  exports: [
    ...MODULES_LIST
  ],
  providers: [
    MusicaService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class MusicaModule { }
