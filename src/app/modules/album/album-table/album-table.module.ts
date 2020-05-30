import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AlbumTableComponent } from './album-table.component';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';

@NgModule({
  declarations: [AlbumTableComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  exports: [
    AlbumTableComponent
  ]
})
export class AlbumTableModule { }
