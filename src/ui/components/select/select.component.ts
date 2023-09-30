import { Component, forwardRef, Input, TemplateRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TuiContextWithImplicit, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';

@Component({
  selector: 'ui-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {

  @tuiPure
  stringify(
    options: readonly any[],
  ): TuiStringHandler<TuiContextWithImplicit<number>> {
    const map = new Map(options.map(({ Id, Description }) => [Id, Description] as [number, string]));
    return ({ $implicit }: TuiContextWithImplicit<number>) => {
      return map.get($implicit) || '';
    };
  }

  @Input() options: Array<any> = [];
  @Input() label: string | TemplateRef<any> = '';
  @Input() required = false;
  @Input() placeholder = 'Seleccione';
  @Input() size: 's' | 'm' | 'l' = 'm';
  @Input() closable = false;
  @Input() ghost = false;
  @Input() offset = 4;

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


export interface UISelectOption {
  Id: string | number,
  Description: string,
  ExtraData?: any
}
