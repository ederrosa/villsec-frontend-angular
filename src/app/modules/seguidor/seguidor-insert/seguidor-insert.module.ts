import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MaterialModule } from 'src/app/core/configurations/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SeguidorInsertComponent } from './seguidor-insert.component';

@NgModule({
  declarations: [SeguidorInsertComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    SeguidorInsertComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SeguidorInsertModule { }
