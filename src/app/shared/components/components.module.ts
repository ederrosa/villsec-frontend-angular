import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FieldsModule } from './fields/fields.module';
import { AlertsModule } from './alerts/alerts.module';
import { ProgressBarModule } from './progress-bar/progress-bar.module';
import { ProgressSpinnerModule } from './progress-spinner/progress-spinner.module';
import { DialogOverviewModule } from './dialog-overview/dialog-overview.module';

const COMPONENSTS_MODULES_LIST = [
  AlertsModule,
  DialogOverviewModule,
  FieldsModule,
  ProgressBarModule,
  ProgressSpinnerModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...COMPONENSTS_MODULES_LIST,
  ],
  exports: [
    ...COMPONENSTS_MODULES_LIST
  ]
})
export class ComponentsModule { }
