import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ElementoFindPageComponent } from './elemento-find-page.component';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';

@NgModule({
  declarations: [ElementoFindPageComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    ElementoFindPageComponent
  ]
})
export class ElementoFindPageModule { }
