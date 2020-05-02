import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainModule } from './main/main.module';
import { MaterialModule } from '../configurations/material/material.module';

const SIMAF_HOME_MODULES_LIST = [
    MainModule    
]
const MATERIAL_LIST = [

]


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MaterialModule,
        ...MATERIAL_LIST,
        ...SIMAF_HOME_MODULES_LIST,
    ],
    exports: [
        ...MATERIAL_LIST,
        ...SIMAF_HOME_MODULES_LIST,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class HomeModule { }
