import { Component, ElementRef, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpInterceptorService } from '@basic/http.interceptor.service';
import { UtilsService } from '@basic/utils.service';
import { TuiInputComponent } from '@taiga-ui/kit';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ui-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UIInputSearchComponent),
      multi: true
    }
  ]
})
export class UIInputSearchComponent implements ControlValueAccessor {

  @Output() onSearch = new EventEmitter<string>();
  @Input() debounceTime = 500;
  @Input() minLengthToSearch = 0;
  @Input() size: 's' | 'm' | 'l' = 'l';
  @Input() placeholder: string = 'Escribe para buscar...';
  @Input() label: string = 'Búsqueda';

  value: any = undefined;
  disabled = false;


  //RXJS
  public httpSubscription: Subscription;
  private searchTimeout: ReturnType<typeof setTimeout> | undefined;

  // Constructor
  constructor(
    public elementRef: ElementRef,
    private utilsService: UtilsService,
    public httpInterceptorService: HttpInterceptorService,
  ) {

  }

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

  handleInput(input: TuiInputComponent): void {
    this.validateTimeOutSubscription();
    this.searchTimeout = setTimeout(() => {
      const inputValue = input.nativeFocusableElement.value;
      this.onSearch.emit(inputValue);
    }, this.debounceTime);
  }

  private validateTimeOutSubscription() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

}
