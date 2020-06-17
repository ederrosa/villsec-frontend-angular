import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const GUARDS_RESOLVERS_LIST = [
    
]

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule
    ],
    exports: [

    ],
    providers: [
        ...GUARDS_RESOLVERS_LIST,        
    ]
})
export class GuardsModule { }
