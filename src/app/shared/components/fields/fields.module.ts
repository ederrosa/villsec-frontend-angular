import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { InputComponent } from './input/input.component';
import { SelectComponent } from './select/select.component';
import { SliderComponent } from './slider/slider.component';
import { TextareaComponent } from './textarea/textarea.component';
import { MaterialModule } from 'src/app/core/configurations/material/material.module';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { FieldsService } from './fields.service';
import { SliderToggleComponent } from './slider-toggle/slider-toggle.component';

const FIELDS_COMPONENTS_LIST = [
    CheckboxComponent,
    DatepickerComponent,
    InputComponent,
    SelectComponent,
    SliderComponent,
    SliderToggleComponent,
    TextareaComponent
]

@NgModule({
    declarations: [...FIELDS_COMPONENTS_LIST],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule
    ],
    exports: [
        ...FIELDS_COMPONENTS_LIST,
    ],
    providers: [FieldsService],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class FieldsModule { }
