import { Component, Input, forwardRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { MyErrorStateMatcherService } from 'src/app/core/services/my-error-state-matcher.service';

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
export class SelectComponent implements ControlValueAccessor, OnDestroy {

  @Input() appearance: string = 'outline';
  @Input() classCss: string = '';
  @Input() label: string = '';
  @Input() hint: string = '';
  @Input() icon: string = '';
  @Input() id: string = '';
  @Input() isReadOnly: boolean;
  @Input() myFormControl: FormControl;
  @Input() options: IOptions[];

  constructor(
    private theErrorStateMatcherService: MyErrorStateMatcherService
  ) { }

  getTheErrorStateMatcherService(): MyErrorStateMatcherService {
    return this.theErrorStateMatcherService;
  }

  get value() {
    return this.myFormControl.value;
  }

  ngOnDestroy() {
    this.options = null;
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
