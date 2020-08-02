import { Component, Input, forwardRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { MyErrorStateMatcherService } from 'src/app/core/services/my-error-state-matcher.service';

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
export class InputComponent implements ControlValueAccessor, OnDestroy {

  @Input() appearance: string = 'outline';
  @Input() classCss: string = '';
  @Input() hint: string = '';
  @Input() icon: string = '';
  @Input() id: string = '';
  @Input() isReadOnly: boolean;
  @Input() label: string = '';
  @Input() maxLength: number = 255;
  @Input() minLength: number = 0;
  @Input() myFormControl: FormControl;
  @Input() placeholder: string = '';  
  @Output() theBlur: EventEmitter<string> = new EventEmitter<string>() ;
  @Input() type: string = 'text'; 

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

  onBlur() {
    this.theBlur.emit();    
  }

  ngOnDestroy(){
    this.theBlur.closed;
    this.theBlur = null;
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
