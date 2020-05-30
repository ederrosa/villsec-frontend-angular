import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';
import { MusicaUpdateComponent } from './musica-update.component';
import { AlbumModule } from '../../album/album.module';



@NgModule({
  declarations: [MusicaUpdateComponent],
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
    MusicaUpdateComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class MusicaUpdateModule { }
