import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ui-button-increment',
  templateUrl: './button-increment.component.html',
  styleUrls: ['./button-increment.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UIButtonIncrementComponent),
      multi: true
    }
  ]
})
export class UIButtonIncrementComponent implements ControlValueAccessor {

  @Input() appearance: 'primary' | 'secondary' | 'secondary' | 'tertiary' | 'secondary-destructive' | 'accent' | 'outline' = 'outline';
  @Input() size: 'xs' | 's' | 'm' | 'l' = 's';
  @Input() min: number = 0;
  @Input() max: number = 1000;

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

  increment() {
    this.quantity++;
    this.onChange(this.quantity);
  }

  decrement() {
    if (this.quantity > this.min) {
      this.quantity--;
      this.onChange(this.quantity);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
