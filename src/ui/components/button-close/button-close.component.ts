import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'button-close',
  templateUrl: './button-close.component.html',
  styleUrls: ['./button-close.component.scss']
})
export class UIButtonCloseComponent {

  @Input() urlRedirect: string;
  @Input() appearance: 'primary' | 'secondary' | 'secondary' | 'tertiary' | 'secondary-destructive' | 'accent' | 'outline' = 'outline';
  @Input() size: 'xs' | 's' | 'm' | 'l' = 's';

  constructor(
    private sanitizer: DomSanitizer
  ) {

  }


}
