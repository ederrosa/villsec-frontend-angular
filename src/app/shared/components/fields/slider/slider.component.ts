import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const INPUT_FIELD_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SliderComponent),
    multi: true
}

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    providers: [INPUT_FIELD_VALUE_ACCESSOR]
})
export class SliderComponent implements ControlValueAccessor {

    @Input() autoTicks: boolean = false;
    @Input() classCss: string = 'example-margin';
    @Input() color: string = 'primary';
    @Input() disabled: boolean = false;
    @Input() id: string;
    @Input() invert: boolean = false;
    @Input() isReadOnly: boolean = false;
    @Input() label: string = '';
    @Input() max: number = 100;
    @Input() min: number = 0;
    @Input() step: number = 1;
    @Input() showTicks: boolean = false;
    @Input() thumbLabel: boolean = true;
    @Input() tickInterval: number = 1;
    @Input() vertical: boolean = false;
    
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

    getSliderTickInterval(): number | 'auto' {
        if (this.showTicks) {
            return this.autoTicks ? 'auto' : this.tickInterval;
        }

        return 0;
    }
}
