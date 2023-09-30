import { Component, HostBinding, Input, HostListener } from '@angular/core';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  private _padding = '0px';
  private _height = 'auto';
  private _width = 'auto';
  private _maxHeight = 'auto';

  @Input() shadow = true;
  @Input() radius = 8;

  @Input() set padding(padding) {
    if (this.padding !== padding) {
      this._padding = padding;
      this.refresh(window.innerWidth, window.innerHeight);
    }
  };
  get padding() { return this._padding };


  @Input() set height(height) {
    if (this.height !== height) {
      this._height = height;
      this.refresh(window.innerWidth, window.innerHeight);
    }
  };
  get height() { return this._height };


  @Input() set width(width) {
    if (this.width !== width) {
      this._width = width;
      this.refresh(window.innerWidth, window.innerHeight);
    }
  };
  get width() { return this._width };


  @Input() set maxHeight(maxHeight) {
    if (this.maxHeight !== maxHeight) {
      this._maxHeight = maxHeight;
      this.refresh(window.innerWidth, window.innerHeight);
    }
  };
  get maxHeight() { return this._maxHeight };


  @HostBinding('style.border-radius')
  get borderRadiusStyle() {
    return `${this.radius}px`;
  }

  constructor(
    private sanitizer: DomSanitizer,
  ) {

  }

  public getStyle() {
    let style: string = `
      display: grid;
      padding: ${this.padding};
      height: ${this.height};
      width: ${this.width};
      max-height: ${this.maxHeight};
      border-radius: ${this.radius}px;
      box-shadow: ${this.shadow ? '0 0.125rem 0.1875rem #0000001a;' : 'none;'}
    `;
    let sanitizerStyle = this.sanitizer.bypassSecurityTrustStyle(style);
    return sanitizerStyle;
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: any) {
    this.refresh(event.target.innerWidth, event.target.innerHeight);
  }

  public refresh(width: number, height: number) {
    this.getStyle();
  }

}
