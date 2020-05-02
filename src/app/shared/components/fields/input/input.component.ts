import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const INPUT_FIELD_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true
}

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    providers: [INPUT_FIELD_VALUE_ACCESSOR]
})
export class InputComponent implements ControlValueAccessor {

    @Input() classCss;
    @Input() id: string;
    @Input() maxlength: number;
    @Input() minlength: number;
    @Input() placeholder: string;
    @Input() hint: string = '';
    @Input() icon: string = '';
    @Input() label = '';
    @Input() type: string = 'text';
    @Input() isReadOnly: boolean = false;
    @Input() appearance: string = 'outline';
    @Input() disabled: boolean = false;
    @Output() theBlur: EventEmitter<string> = new EventEmitter<string>();

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

    onBlur() {
        this.theBlur.emit();
    }
}
