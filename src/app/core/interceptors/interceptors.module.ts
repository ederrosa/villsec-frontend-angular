import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorInterceptorService } from './error-interceptor.service';
import { AuthInterceptorService } from './auth-interceptor.service';

const INTERCEPTORS_LIST = [
    AuthInterceptorService,
    ErrorInterceptorService
]

@NgModule({
  declarations: [],
  imports: [
        CommonModule
    ],
    exports: [

    ],
    providers: [
        ...INTERCEPTORS_LIST
    ]

})
export class InterceptorsModule { }
