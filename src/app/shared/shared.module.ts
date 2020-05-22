import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from './components/components.module';
import { PipesModule } from './pipes/pipes.module';

const SHARED_MODULES_LIST = [
  ComponentsModule,
  PipesModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...SHARED_MODULES_LIST
  ],
  exports: [
    ...SHARED_MODULES_LIST    
  ]
})
export class SharedModule { }
