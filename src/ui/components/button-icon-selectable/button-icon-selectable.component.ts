import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'button-icon-selectable',
  templateUrl: './button-icon-selectable.component.html',
  styleUrls: ['./button-icon-selectable.component.scss']
})
export class UIButtonIconSelectableComponent {

  @Input() icon: string;
  @Input() label: String;
  @Input() orientation: 'horizontal' | 'vertical' = 'vertical';
  @Input() selected: boolean = false;

  constructor(
    private sanitizer: DomSanitizer
  ) {

  }


}
