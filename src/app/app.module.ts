import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'
import { MAT_LABEL_GLOBAL_OPTIONS } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './core/configurations/material/material.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { ErrorModule } from './modules/error/error.module';
import { AuthGuard } from './core/guards/can-activate/auth-guard';
import { AuthenticationService } from './core/authentication/authentication.service';
import { ErrorInterceptorProvider } from './core/interceptors/error-interceptor.service';
import { AuthInterceptorProvider } from './core/interceptors/auth-interceptor.service';
import { BannerModule } from './modules/banner/banner.module';

registerLocaleData(localePt);

const COMPONENTS_LIST = [

]

const MATERIAL_MODULES_LIST = [
  MaterialModule,
]

const MODULES_LIST = [
  BannerModule,
  CoreModule,
  ErrorModule,
  SharedModule
]

const SERVICES_LIST = [
  AuthGuard,
  AuthenticationService,
  //AuthInterceptorProvider,
  ErrorInterceptorProvider,
]

@NgModule({
  declarations: [
    AppComponent,
    ...COMPONENTS_LIST,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ...MATERIAL_MODULES_LIST,
    ...MODULES_LIST
  ],
  providers: [
    ...SERVICES_LIST,
    { provide: LOCALE_ID, useValue: "pt" },
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'always' } },
  ],
  bootstrap: [
    AppComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
