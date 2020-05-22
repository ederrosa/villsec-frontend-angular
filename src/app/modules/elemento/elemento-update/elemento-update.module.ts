import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElementoUpdateComponent } from './elemento-update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ElementoUpdateComponent],
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
    ElementoUpdateComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ElementoUpdateModule { }
