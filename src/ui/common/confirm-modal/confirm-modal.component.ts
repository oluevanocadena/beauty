import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {

  // Show
  private _show: boolean = false;
  @Input() set show(show: boolean) {
    if (this.show !== show) {
      this._show = show;
      this.showChange.emit(this.show);
    }
  };
  get show() { return this._show };
  @Output() showChange = new EventEmitter<boolean>();

  // Inputs
  @Input() title: string;
  @Input() message: string;
  @Input() confirmText: string = 'Confirmar';
  @Input() metadata: any;

  @Output() onConfirm = new EventEmitter<any>();
  @Output() onCancelConfirm = new EventEmitter();

  constructor(
    private sanitizer: DomSanitizer
  ) {

  }

  isString(value: any): boolean {
    return typeof value === 'string';
  }

  confirm() {
    this.onConfirm.emit(this.metadata);
    this.handleCancel(false);
  }

  handleCancel(emitCancel = true) {
    this.show = false;
    this.showChange.emit(this.show);
    if (emitCancel) {
      this.onCancelConfirm.emit();
    }
  }

}
