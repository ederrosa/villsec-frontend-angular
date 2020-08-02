import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { MyErrorStateMatcherService } from 'src/app/core/services/my-error-state-matcher.service';

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
  @Input() classCss: string = '';
  @Input() disabledDatepicker: boolean = false;
  @Input() id: string = '';
  @Input() isReadOnly: boolean;
  @Input() label: string = '';
  @Input() minDate: number;
  @Input() maxDate: number;
  @Input() myFormControl: FormControl;
  @Input() placeholder: string = 'Escolha uma data';
  @Input() startDate: string = '';
  @Input() startView: string = 'year';

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
