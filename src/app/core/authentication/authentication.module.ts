import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { MaterialModule } from '../configurations/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const LOGIN_COMPONENTS_LIST = [
    LoginComponent
]

@NgModule({
    declarations: [
        ...LOGIN_COMPONENTS_LIST
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class AuthenticationModule { }
