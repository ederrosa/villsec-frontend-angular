import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImagemRoutingModule } from './imagem-routing.module';
import { RouterModule } from '@angular/router';
import { ImagemService } from './imagem.service';
import { ImagemFindPageModule } from './imagem-find-page/imagem-find-page.module';
import { ImagemInsertModule } from './imagem-insert/imagem-insert.module';
import { ImagemUpdateModule } from './imagem-update/imagem-update.module';
import { ImagemCubeDialogOverviewModule } from './imagem-banner/imagem-cube-dialog-overview.module';

const MODULES_LIST = [
  ImagemCubeDialogOverviewModule,
  ImagemFindPageModule,
  ImagemInsertModule,
  ImagemUpdateModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    ImagemRoutingModule,
    ...MODULES_LIST
  ],
  exports: [
    ...MODULES_LIST
  ],
  providers: [
    ImagemService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ImagemModule { }
