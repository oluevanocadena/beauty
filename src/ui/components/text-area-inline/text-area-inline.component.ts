import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';

@Component({
  selector: 'ui-text-area-inline',
  templateUrl: './text-area-inline.component.html',
  styleUrls: ['./text-area-inline.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UITextareaInlineComponent),
      multi: true
    }
  ]
})
export class UITextareaInlineComponent implements ControlValueAccessor {

  @Input() placeholder: string;
  @Input() preventEnter: boolean = false;
  @Output() onEnter = new EventEmitter<string>();

  value: string;
  onChange: (value: string) => void;
  onTouched: () => void;

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  updateValue(value: string): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  /**
   * UI Helpers
   */
  enter(event: Event) {
    if (this.preventEnter) event.preventDefault();
    this.onEnter.emit(this.value);
  }
}
