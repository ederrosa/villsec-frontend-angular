import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AlbumRoutingModule } from './album-routing.module';
import { AlbumService } from './album.service';
import { AlbumFindPageModule } from './album-find-page/album-find-page.module';
import { AlbumInsertModule } from './album-insert/album-insert.module';
import { AlbumTableModule } from './album-table/album-table.module';
import { AlbumUpdateModule } from './album-update/album-update.module';

const MODULES_LIST = [
  AlbumFindPageModule,
  AlbumInsertModule,
  AlbumTableModule,
  AlbumUpdateModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    AlbumRoutingModule,
    ...MODULES_LIST
  ],
  exports: [
    ...MODULES_LIST
  ],
  providers: [
    AlbumService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AlbumModule { }
