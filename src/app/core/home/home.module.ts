import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../configurations/material/material.module';
import { AdminModule } from './admin/admin.module';
import { DefaultModule } from './default/default.module';
import { ProprietarioModule } from './proprietario/proprietario.module';
import { SeguidorModule } from './seguidor/seguidor.module';
import { MainComponent } from './main/main.component';

const HOME_MODULES_LIST = [
  AdminModule,
  DefaultModule,
  ProprietarioModule,
  SeguidorModule
]

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ...HOME_MODULES_LIST,
  ],
  exports: [
    MainComponent,
    ...HOME_MODULES_LIST,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class HomeModule { }
