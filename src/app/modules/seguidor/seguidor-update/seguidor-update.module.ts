import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SeguidorUpdateComponent } from './seguidor-update.component';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [SeguidorUpdateComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    SeguidorUpdateComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SeguidorUpdateModule { }
