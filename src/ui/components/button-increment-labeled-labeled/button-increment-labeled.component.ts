import { Component, Input, TemplateRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ui-button-increment-labeled',
  templateUrl: './button-increment-labeled.component.html',
  styleUrls: ['./button-increment-labeled.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UIButtonIncrementLabeledComponent),
      multi: true
    }
  ]
})
export class UIButtonIncrementLabeledComponent implements ControlValueAccessor {

  @Input() appearance: 'primary' | 'secondary' | 'secondary' | 'tertiary' | 'secondary-destructive' | 'accent' | 'outline' = 'outline';
  @Input() size: 'xs' | 's' | 'm' | 'l' = 's';
  @Input() min: number = 0;
  @Input() max: number = 1000;
  @Input() title: string | TemplateRef<any>;
  @Input() titleSize: number = 15;
  @Input() subtitle: string | TemplateRef<any>;
  @Input() subtitleSize: number = 13;

  quantity = 0;

  // Funciones para la implementación de ControlValueAccessor
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  writeValue(val: number): void {

    if (val < this.min) {
      val = this.min;
    }

    if (val) {
      this.quantity = val;
    }

  }

  onChangeButtonIncrementValue() {
    this.writeValue(this.quantity);
    this.onChange(this.quantity);
    this.onTouched();
  }


  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
