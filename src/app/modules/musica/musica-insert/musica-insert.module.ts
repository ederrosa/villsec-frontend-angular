import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MusicaInsertComponent } from './musica-insert.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';
import { AlbumModule } from '../../album/album.module';

@NgModule({
  declarations: [MusicaInsertComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AlbumModule,
    RouterModule,
    SharedModule,
  ],
  exports: [
    MusicaInsertComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class MusicaInsertModule { }
