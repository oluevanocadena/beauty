import { Component, EventEmitter, Input, Output, forwardRef, Self, Inject, ChangeDetectionStrategy } from '@angular/core';
import { HelperPage } from '../base/helper.page';

import { TUI_ARROW } from '@taiga-ui/kit';
import { UISelectOption } from '../select/select.component';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { UtilsService } from '@basic/utils.service';
import { TuiDestroyService } from '@taiga-ui/cdk';

@Component({
  selector: 'dropdown-option-group',
  templateUrl: './dropdown-option-group.component.html',
  styleUrls: ['./dropdown-option-group.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownOptionGroupComponent),
      multi: true
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownOptionGroupComponent extends HelperPage {

  // Flag Management
  open = false;

  // Input parameters
  @Input() options: Array<UISelectOption> = [];
  @Input() busy: boolean = false;
  @Input() label: string;
  @Input() placeholder: string = 'Seleccione';
  @Input() appearance: 'primary' | 'secondary' | 'tertiary' | 'secondary-destructive' | 'accent' = 'tertiary';

  // Output Events
  @Output() onConfirmDelete = new EventEmitter<boolean>();
  @Output() onSelect = new EventEmitter<any>();

  // Icons
  readonly arrow = TUI_ARROW;

  //Private variables
  protected showDelete = false;

  // Form Groups
  readonly form = new FormGroup({
    SelectedOption: new FormControl('', [Validators.required]),
  });


  // Value Accessor
  value: any = undefined;
  disabled = false;

  onChange = (_: any) => { };
  onTouched = () => { };


  constructor(
    public utilsService: UtilsService,
  ) {
    super();
  }


  writeValue(value: any) {
    if (this.value !== value) {
      this.value = value;
      this.form.controls['SelectedOption'].patchValue(value);
    }
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
    this.open = false;
    this.onSelect.emit(this.form.controls['SelectedOption'].value);
  }

  get selectedOptionName() {
    return this.options?.find(x => x.Id?.toString() === this.form.controls['SelectedOption'].value?.toString())?.Description || this.placeholder
  }



}
