import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ui-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class UIImageComponent {

  private _src: string = '';
  @Input() set src(src) {
    this._src = src;
  };
  get src() { return this._src };

  private _height: string = 'auto';
  @Input() set height(height) {
    this._height = height;
  };
  get height() { return this._height };

  @Input() radius = 8;
  @Input() hoverable = true;
  @Input() loading = false;
  @Input() skeletonWidth = '100%';


  constructor(
    private sanitizer: DomSanitizer
  ) {

  }

  public getStyle() {
    let style: string = '';
    style = `

          height: ${this.height};
          border-radius: ${this.radius}px;
      `;
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }

}
