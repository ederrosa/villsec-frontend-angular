import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AlbumFindPageComponent } from './album-find-page.component';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';



@NgModule({
  declarations: [AlbumFindPageComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    AlbumFindPageComponent
  ]
})
export class AlbumFindPageModule { }
