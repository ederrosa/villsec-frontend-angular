import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MusicaFindPageComponent } from './musica-find-page.component';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';
import { AlbumModule } from '../../album/album.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [MusicaFindPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RouterModule,
    AlbumModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    MusicaFindPageComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class MusicaFindPageModule { }
