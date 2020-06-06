import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProprietarioFindPageComponent } from './proprietario-find-page.component';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';

@NgModule({
  declarations: [ProprietarioFindPageComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  exports: [
    ProprietarioFindPageComponent
  ]
})
export class ProprietarioFindPageModule { }
