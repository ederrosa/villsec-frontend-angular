import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AlbumUpdateComponent } from './album-update.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';



@NgModule({
  declarations: [AlbumUpdateComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    AlbumUpdateComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AlbumUpdateModule { }
