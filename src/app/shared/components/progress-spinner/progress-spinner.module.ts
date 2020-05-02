import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'src/app/core/configurations/material/material.module';
import { ProgressSpinnerOverviewComponent } from './progress-spinner-overview/progress-spinner-overview.component';

const PROGRESS_SPINNERS_COMPONENTS_LIST = [
    ProgressSpinnerOverviewComponent
]

@NgModule({
    declarations: [...PROGRESS_SPINNERS_COMPONENTS_LIST],
    imports: [
        CommonModule,
        MaterialModule
    ],
    exports: [
        ...PROGRESS_SPINNERS_COMPONENTS_LIST
    ],
    entryComponents: [
        ProgressSpinnerOverviewComponent
    ]
})
export class ProgressSpinnerModule { }
