import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const INPUT_FIELD_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextareaComponent),
    multi: true
}

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
    styleUrls: ['./textarea.component.scss'],
    providers: [INPUT_FIELD_VALUE_ACCESSOR]
})
export class TextareaComponent implements ControlValueAccessor {

    @Input() classCss;
    @Input() id: string;
    @Input() label = '';
    @Input() maxlength = 255;
    @Input() minlength = 0;
    @Input() placeholder: string;
    @Input() hint = '';
    @Input() isReadOnly = false;
    @Input() maxheight = 100;
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
