import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MusicaDialogOverviewComponent } from './musica-dialog-overview.component';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';

@NgModule({
  declarations: [MusicaDialogOverviewComponent],
  imports: [
    CommonModule,
    MaterialModule,
    PipesModule
  ],
  exports: [
    MusicaDialogOverviewComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class MusicaDialogOverviewModule { }
