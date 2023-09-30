import { Component, EventEmitter, Input, Output } from '@angular/core';

import { HelperPage } from '../base/helper.page';


@Component({
  selector: 'dropdown-actions',
  templateUrl: './dropdown-actions.component.html',
  styleUrls: ['./dropdown-actions.component.scss']
})
export class DropdownActionsComponent extends HelperPage {

  // Input parameters
  @Input() actions = new Array<UIDropdownActions>();

  // Open
  private _openDropdown: boolean = false;
  @Input() set openDropdown(openDropdown: boolean) {
    if (this.openDropdown !== openDropdown) {
      this._openDropdown = openDropdown;
    }
  };
  get openDropdown() { return this._openDropdown };
  @Output() openDropdownChange = new EventEmitter<boolean>();

  constructor(
  ) {
    super();
  }

}


export interface UIDropdownActions {
  Name: string;
  Params?: any;
  Appearance: 'primary' | 'secondary' | 'secondary' | 'tertiary' | 'secondary-destructive' | 'accent' | 'outline';
  Method: (...args: any[]) => void;
  Disabled?: boolean;
}
