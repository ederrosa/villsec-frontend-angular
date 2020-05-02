import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'src/app/core/configurations/material/material.module';

const PROGRESS_BAR_COMPONENTS_LIST = [
   
]

@NgModule({
    declarations: [...PROGRESS_BAR_COMPONENTS_LIST],
    imports: [
        CommonModule,
        MaterialModule
    ],
    exports: [
        ...PROGRESS_BAR_COMPONENTS_LIST
    ]
})
export class ProgressBarModule { }
