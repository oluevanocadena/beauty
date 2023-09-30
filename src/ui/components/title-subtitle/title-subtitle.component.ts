import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ui-title-subtitle',
  templateUrl: './title-subtitle.component.html',
  styleUrls: ['./title-subtitle.component.scss']
})
export class UITitleSubTitleComponent {

  @Input() title: string;
  @Input() subtitle: string;
  @Input() size: 's' | 'm' | 'l' = 'm';
  @Input() bold: boolean = false;

  constructor(
    private sanitizer: DomSanitizer
  ) {

  }

  get xsTitleSize() {
    let titleSize = 'tui-text_h6';
    switch (this.size) {
      case 's':
        titleSize = 'tui-text_h6';
        break;
      case 'm':
        titleSize = 'tui-text_h6';
        break;
      case 'l':
        titleSize = 'tui-text_h5';
        break;
    }
    return titleSize;
  }

  get mdTitleSize() {
    let titleSize = 'tui-text_h5';
    switch (this.size) {
      case 's':
        titleSize = 'tui-text_h6';
        break;
      case 'm':
        titleSize = 'tui-text_h6';
        break;
      case 'l':
        titleSize = 'tui-text_h4';
        break;
    }
    return titleSize;
  }

}
