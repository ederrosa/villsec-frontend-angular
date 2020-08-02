import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { MyErrorStateMatcherService } from 'src/app/core/services/my-error-state-matcher.service';

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
 
  @Input() checked: boolean;
  @Input() classCss: string = 'example-margin';
  @Input() color: string = 'primary';
  @Input() id: string;
  @Input() isReadOnly: boolean;
  @Input() label: string = '';
  @Input() myFormControl: FormControl;
  @Input() text: string = '';

  constructor(
    private theErrorStateMatcherService: MyErrorStateMatcherService
  ) { }

  getTheErrorStateMatcherService(): MyErrorStateMatcherService {
    return this.theErrorStateMatcherService;
  }

  get value() {
    return this.myFormControl.value;
  }

  set value(v: any) {
    if (v !== this.myFormControl.value) {
      this.myFormControl.setValue(v);
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
