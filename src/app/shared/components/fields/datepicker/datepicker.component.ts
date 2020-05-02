import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const INPUT_FIELD_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatepickerComponent),
    multi: true
}

@Component({
    selector: 'app-datepicker',
    templateUrl: './datepicker.component.html',
    styleUrls: ['./datepicker.component.scss'],
    providers: [INPUT_FIELD_VALUE_ACCESSOR]
})
export class DatepickerComponent implements ControlValueAccessor {

    @Input() appearance: string = 'outline';
    @Input() classCss;
    @Input() disabled: boolean = false;
    @Input() id: string;
    @Input() isReadOnly: boolean = false;
    @Input() label: string = '';
    @Input() minDate: number;
    @Input() maxDate: number;
    @Input() placeholder: string = 'Escolha uma data';
    @Input() startDate: string = '';
    @Input() startView: string = 'year';

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
