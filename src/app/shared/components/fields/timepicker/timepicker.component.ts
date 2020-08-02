import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { MyErrorStateMatcherService } from 'src/app/core/services/my-error-state-matcher.service';

const INPUT_FIELD_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TimepickerComponent),
  multi: true
}

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
  providers: [INPUT_FIELD_VALUE_ACCESSOR]
})
export class TimepickerComponent implements ControlValueAccessor {

  @Input() appearance: string = 'outline';
  @Input() appendToInput: string;
  @Input() classCss: string;
  @Input() defaultTime: string;
  @Input() format: string;
  @Input() id: string;
  @Input() isReadOnly: boolean;
  @Input() label: string = 'Custom theme';
  @Input() min: number;
  @Input() max: number;
  @Input() myFormControl: FormControl;
  @Input() timepicker: string = 'darkPicker';
  @Input() placeholder: string = 'Escolha o Horário';
  @Input() theme: string = 'darkTheme';

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

  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#424242', buttonColor: '#fff'
    }

    , dial: {
      dialBackgroundColor: '#555',
    }

    , clockFace: {
      clockFaceBackgroundColor: '#555', clockHandColor: '#9fbd90', clockFaceTimeInactiveColor: '#fff'
    }
  };
}
