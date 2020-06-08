import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SeguidorFindPageComponent } from './seguidor-find-page.component';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';

@NgModule({
  declarations: [SeguidorFindPageComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  exports: [
    SeguidorFindPageComponent
  ]
})
export class SeguidorFindPageModule { }
