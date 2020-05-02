import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const INPUT_FIELD_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SliderToggleComponent),
  multi: true
}

@Component({
  selector: 'app-slider-toggle',
  templateUrl: './slider-toggle.component.html',
  styleUrls: ['./slider-toggle.component.scss'],
  providers: [INPUT_FIELD_VALUE_ACCESSOR]
})
export class SliderToggleComponent implements ControlValueAccessor {

  @Input() color: string = 'primary';
  @Input() checked: boolean = false;
  @Input() classCss: string = 'example-margin';
  @Input() disabled: boolean = false;
  @Input() id: string;
  @Input() label: string = '';
  @Input() isReadOnly: boolean = false;
  @Input() text: string = '';

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
