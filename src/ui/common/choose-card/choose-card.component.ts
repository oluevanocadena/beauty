import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

import { RouterService } from '@basic/routes.service';

import { HelperPage } from '../../components/base/helper.page';

@Component({
  selector: 'choose-card',
  templateUrl: './choose-card.component.html',
  styleUrls: ['./choose-card.component.scss']
})
export class ChooseCardComponent extends HelperPage {

  // Input parameters
  @Input() readonly: boolean = false;
  @Input() label: string | TemplateRef<any>;
  @Input() buttonText: string = 'Cambiar';
  @Input() mode: 'choose' | 'delete' | 'more' = 'choose';
  @Input() appearance: 'primary' | 'secondary' | 'secondary-destructive' | 'outline' | 'accent' = 'primary';
  @Input() size: 's' | 'm' | 'l' = 'm';
  @Input() actions: UIChooseActions[] = [];
  @Input() metadata: any;
  @Input() busy: boolean = false;

  @Output() onChoose = new EventEmitter<boolean>();


  constructor(
    private routerService: RouterService,
  ) {
    super();
  }


  choose() {
    this.onChoose.emit(true);
  }

  isString() {
    return typeof this.label === 'string';
  }

}


export interface UIChooseActions {
  Label: string;
  Appearance: 'primary' | 'secondary' | 'secondary-destructive' | 'outline' | 'accent';
  Size: 's' | 'm' | 'l';
  Action: (...params: any[]) => void;
}
