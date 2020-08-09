import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';
import { InformativeAlertComponent } from './informative-alert/informative-alert.component';
import { ConfirmationAlertComponent } from './confirmation-alert/confirmation-alert.component';

const ALERTS_COMPONENTS_LIST = [
    InformativeAlertComponent,
    ConfirmationAlertComponent
]

@NgModule({
    declarations: [...ALERTS_COMPONENTS_LIST],
    imports: [
        CommonModule,
        MaterialModule
    ],
    exports: [
        ...ALERTS_COMPONENTS_LIST
    ]
})
export class AlertsModule { }
