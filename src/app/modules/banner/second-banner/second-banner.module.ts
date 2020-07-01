import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondBannerComponent } from './second-banner.component';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { MusicaDialogOverviewModule } from '../../musica/musica-dialog-overview/musica-dialog-overview.module';

@NgModule({
  declarations: [SecondBannerComponent],
  imports: [
    CommonModule,
    MaterialModule,
    MusicaDialogOverviewModule,
    PipesModule,
    RouterModule,
  ],
  exports: [
    SecondBannerComponent
  ],
  providers: [
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SecondBannerModule { }
