import { BrowserModule } from '@angular/platform-browser';
<<<<<<< HEAD
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

registerLocaleData(localePt);

const SERVICES_LIST = [
  
]

const COMPONENTS_LIST = [

]

const MODULES_LIST = [
  CoreModule,
  SharedModule
]

const MATERIAL_MODULES_LIST = [
  MaterialModule,
]

@NgModule({
  declarations: [
    AppComponent,
    ...COMPONENTS_LIST

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
=======
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
>>>>>>> 693e69643bfad85477a797f4b8532cb28a9bc310
})
export class AppModule { }
