import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EventoFindPageComponent } from './evento-find-page.component';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';



@NgModule({
  declarations: [EventoFindPageComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    EventoFindPageComponent
  ]
})
export class EventoFindPageModule { }
