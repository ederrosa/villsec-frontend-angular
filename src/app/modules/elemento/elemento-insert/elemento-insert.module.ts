import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from 'src/app/core/configurations/material/material.module';
import { ElementoInsertComponent } from './elemento-insert.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ElementoInsertComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    PipesModule,    
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    ElementoInsertComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ElementoInsertModule { }
