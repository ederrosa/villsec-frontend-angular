import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MainComponent } from './main.component';
import { MaterialModule } from '../../configurations/material/material.module';

@NgModule({
    declarations: [MainComponent],
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule,
    ],
    exports: [
        MainComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class MainModule { }
