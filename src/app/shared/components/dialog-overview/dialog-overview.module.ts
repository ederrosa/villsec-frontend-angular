import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogOverviewImageComponent } from './dialog-overview-image/dialog-overview-image.component';
import { DialogOverviewAudioComponent } from './dialog-overview-audio/dialog-overview-audio.component';
import { DialogOverviewVideoComponent } from './dialog-overview-video/dialog-overview-video.component';
import { DialogOverviewTextComponent } from './dialog-overview-text/dialog-overview-text.component';
import { DialogOverviewIframeComponent } from './dialog-overview-iframe/dialog-overview-iframe.component';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';
import { PipesModule } from '../../pipes/pipes.module';

const DIALOG_OVERVIEW_COMPONENTS_LIST = [
  DialogOverviewAudioComponent,
  DialogOverviewImageComponent,
  DialogOverviewIframeComponent,
  DialogOverviewTextComponent,
  DialogOverviewVideoComponent
]

@NgModule({
  declarations: [...DIALOG_OVERVIEW_COMPONENTS_LIST],
  imports: [
    CommonModule,
    MaterialModule,
    PipesModule
  ],
  exports: [
    ...DIALOG_OVERVIEW_COMPONENTS_LIST
  ],
  entryComponents: [
    ...DIALOG_OVERVIEW_COMPONENTS_LIST
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class DialogOverviewModule { }
