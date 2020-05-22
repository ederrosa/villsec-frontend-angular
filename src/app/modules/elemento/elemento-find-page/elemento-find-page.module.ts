import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ElementoFindPageComponent } from './elemento-find-page.component';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';

@NgModule({
  declarations: [ElementoFindPageComponent],
  imports: [
    CommonModule,
    MaterialModule,
    PipesModule,
    RouterModule,
  ],
  exports: [
    ElementoFindPageComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ElementoFindPageModule { }
