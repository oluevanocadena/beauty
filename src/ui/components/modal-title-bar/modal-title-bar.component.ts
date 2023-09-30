import { Component, Input, Output, EventEmitter } from '@angular/core';

import { HelperPage } from '../base/helper.page';


@Component({
  selector: 'ui-modal-title-bar',
  templateUrl: './modal-title-bar.component.html',
  styleUrls: ['./modal-title-bar.component.scss']
})
export class UIModalTitleBarComponent extends HelperPage {

  // Input parameters
  @Input() title: string;

  @Output() onClose = new EventEmitter<boolean>();

  constructor(
  ) {
    super();
  }

  handleCancel() {
    this.onClose.emit(true);
  }

}
