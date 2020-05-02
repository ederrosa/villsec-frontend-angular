import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const INPUT_FIELD_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true
}

export interface IOptions {
    value: any;
    option: string;
}

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    providers: [INPUT_FIELD_VALUE_ACCESSOR]
})
export class SelectComponent implements ControlValueAccessor {

    @Input() options: IOptions[];
    @Input() classCss;
    @Input() id: string;
    @Input() label = '';
    @Input() hint = '';
    @Input() icon = '';
    @Input() isReadOnly = false;
    @Input() appearance = 'outline';    

    private innerValue: any;

    get value() {
        return this.innerValue;        
    }

    set value(v: any) {
        if (v !== this.innerValue) {            
            this.innerValue = v;
            this.onChangeCb(v);           
        }
    }

    onChangeCb: (_: any) => void = () => { };

    onTouchedCb: (_: any) => void = () => { };

    writeValue(obj: any): void {
        this.value = obj;
    }
    registerOnChange(fn: any): void {        
        this.onChangeCb = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouchedCb = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.isReadOnly = isDisabled;
    }

   
}
