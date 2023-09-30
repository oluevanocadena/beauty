import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HelperPage } from '../../components/base/helper.page';

import { TUI_ARROW } from '@taiga-ui/kit';
import { RouterService } from '@basic/routes.service';

@Component({
  selector: 'action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss']
})
export class ActionBarComponent extends HelperPage {

  // Input parameters
  @Input() actionExtras: Array<ActionBar> = [];
  @Input() busy: boolean = false;
  @Input() canBack: boolean = true;
  @Input() cancelUrlRedirect: string;
  @Input() canDelete: boolean = true;
  @Input() canSave: boolean = false;
  @Input() confirmMessage: string;
  @Input() editable: boolean = false;
  @Input() itemName: string;
  @Input() pronoun: string = 'el';
  @Input() saveText: string = 'Guardar';
  @Input() showSave: boolean = true;

  // Output Events
  @Output() onConfirmDelete = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<boolean>();

  private actions: ActionBar[] = [{ Name: 'Eliminar', Appearance: 'secondary-destructive', Method: () => { this.showDelete = true; } }];


  // Open
  private _openDropdown: boolean = false;
  @Input() set openDropdown(openDropdown: boolean) {
    if (this.openDropdown !== openDropdown) {
      this._openDropdown = openDropdown;
    }
  };
  get openDropdown() { return this._openDropdown };
  @Output() openDropdownChange = new EventEmitter<boolean>();

  // Icons
  readonly arrow = TUI_ARROW;

  //Private variables
  protected showDelete = false;
  protected showConfirm = false;

  constructor(
    private routerService: RouterService,
  ) {
    super();
  }

  onConfirmCancel() {
    this.routerService.goTo(this.cancelUrlRedirect);
    this.handleCancel();
  }

  validateBackAction() {
    if (this.canBack) {
      this.onConfirmCancel();
    }
    else {
      this.showConfirm = true;
    }
  }

  confirmDelete() {
    this.onConfirmDelete.emit(true);
  }

  save() {
    this.onSave.emit(true);
  }


  handleCancel() {
    this.showDelete = false;
  }

  /**
 * @section Getters
 */

  get Actions() {
    return this.canDelete ? this.actions.concat(this.actionExtras) : this.actions.concat(this.actionExtras).filter(x => x.Name !== 'Eliminar');
  }


}




export interface ActionBar {
  Name: string;
  Params?: any;
  Appearance: 'primary' | 'secondary' | 'secondary' | 'tertiary' | 'secondary-destructive' | 'accent' | 'outline';
  Method: (...args: any[]) => void;
}
