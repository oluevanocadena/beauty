import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TuiButtonOptions } from '@taiga-ui/core';

@Component({
  selector: 'ui-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class UIButtonComponent {

  @Input() appearance: TuiButtonOptions['appearance'] = 'primary';
  @Input() darkMode: boolean = false;
  @Input() height: string;
  @Input() icon: string;
  @Input() iconColorClass: string = 'f-black-1';
  @Input() iconSize: string = '24px';
  @Input() label: String;
  @Input() shape: "rounded" | "square" | null = null;
  @Input() size: "m" | "l" | "xl" | "s" | "xs" = 'm';
  @Input() textColorClass: string = 'f-black-1';
  @Input() textSize: string = '15px';
  @Input() width: string;

  constructor(
    private sanitizer: DomSanitizer
  ) {

  }


}
