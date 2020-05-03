import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterceptorsModule } from './interceptors/interceptors.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { HomeModule } from './home/home.module';
import { StorageService } from './services/storage.service';
import { FileUtilitiesService } from './services/file-utilities.service';
import { GuardsModule } from './guards/guards.module';
import { CepService } from './services/cep.service';
import { UnsubscribeControlService } from './services/unsubscribe-control.service';

const CORE_MODULES_LIST = [
    AuthenticationModule,
    GuardsModule,
    HomeModule,
    InterceptorsModule
]

const CORE_SERVICES_LIST = [
    CepService,
    FileUtilitiesService,
    StorageService,
    UnsubscribeControlService
]

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ...CORE_MODULES_LIST
    ],
    exports: [
        ...CORE_MODULES_LIST
    ],
    providers: [
        ...CORE_SERVICES_LIST
    ]
})
export class CoreModule { }
