import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Error401Component } from './error401/error401.component';
import { Error403Component } from './error403/error403.component';
import { Error422Component } from './error422/error422.component';
import { Error404Component } from './error404/error404.component';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';

const SIMAF_ERROR_COMPONENTS_LIST = [
    Error401Component,
    Error403Component,
    Error422Component,
    Error404Component
]

@NgModule({
    declarations: [
        ...SIMAF_ERROR_COMPONENTS_LIST
    ],
    imports: [
      CommonModule,
      MaterialModule
        
    ], exports: [
        ...SIMAF_ERROR_COMPONENTS_LIST
    ],
    providers: [
        
    ]
})
export class ErrorModule { }
