import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from './safe.pipe';

const PIPES_LIST = [
  SafePipe
]


@NgModule({
  declarations: [...PIPES_LIST],
  imports: [
    CommonModule
  ],
  exports: [
    ...PIPES_LIST
  ]
})
export class PipesModule { }
