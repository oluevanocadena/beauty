import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TuiContextWithImplicit, TuiIdentityMatcher, TuiStringHandler } from '@taiga-ui/cdk';

@Component({
  selector: 'multiselect-tui',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UIMultiSelectComponent),
      multi: true
    }
  ]
})
export class UIMultiSelectComponent implements ControlValueAccessor {


  readonly stringify: TuiStringHandler<any | TuiContextWithImplicit<any>> = item => 'Description' in item ? item.Description : item.$implicit.Description;
  readonly identityMatcher: TuiIdentityMatcher<any> = (item1, item2) => item1.Id === item2.Id;

  @Input() options: Array<UIMultiSelectOption> = [];
  @Input() label = '';

  value: any = undefined;
  disabled = false;

  onChange = (_: any) => { };
  onTouched = () => { };

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  onInnerComponentValueChange(value: any) {
    this.value = value;
    this.writeValue(value);
    this.onChange(value);
    this.onTouched();
  }

}


export interface UIMultiSelectOption {
  Id: number,
  Description: string,
}
