import { Injectable } from '@angular/core';
import { IOptions } from './select/select.component';

@Injectable({
    providedIn: 'root'
})
export class FieldsService {

    constructor() { }

    getItemOfSelect(theOption: IOptions[], key: any) {

        for (let option of theOption) {
            if (option.option == key || option.value == key) {
                return option.value;
            }
        }
        return null;
    }
}
