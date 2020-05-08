import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AlbumInsertComponent } from './album-insert.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';

@NgModule({
  declarations: [AlbumInsertComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    AlbumInsertComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AlbumInsertModule { }
