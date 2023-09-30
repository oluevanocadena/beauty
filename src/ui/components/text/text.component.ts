import { Component, HostBinding, HostListener, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeStyle } from '@angular/platform-browser';


@Component({
  selector: 'ui-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class UITextComponent {

  private _style: SafeStyle;
  private _class: string;

  // Screen Sizes
  @Input() xs: any;
  @Input() sm: any;
  @Input() md: any;
  @Input() lg: any;
  @Input() xl: any;
  @Input() padding = '0';
  @Input() wrap: boolean = false;
  @Input() align: 'left' | 'right' | 'center' = 'left';


  @HostBinding('style') get style() { return this._style; }
  @HostBinding('class') get classNames(): string {
    return this._class;
  }
  @HostListener('window:resize', ['$event'])
  public onResize(event: any) {
    this.refresh(event.target.innerWidth, event.target.innerHeight);
  }


  // Constructor
  constructor(
    private sanitizer: DomSanitizer
  ) {

  }

  ngOnChanges(changes: SimpleChanges) {
    this.sm = this.sm || this.xs;
    this.md = this.md || this.sm;
    this.lg = this.lg || this.md;
    this.xl = this.xl || this.lg;
    this.refresh(window.innerWidth, window.innerHeight);
  }

  public refresh(width: number, height: number) {
    this.setClasses(width, height);
    this.createStyle();
  }

  public createStyle() {
    let style = `
          display: block;
          padding: ${this.padding};
          text-align: ${this.align};
      `;
    let styleSafe: SafeStyle = this.sanitizer.bypassSecurityTrustStyle(style);
    if (this._style !== styleSafe) {
      this._style = style;
    }
  }

  public setClasses(width: number, height: number) {
    this._class = width >= 1366 ? this.xl : this._class;
    this._class = width >= 1025 && width < 1366 ? this.lg : this._class;
    this._class = width >= 768 && width <= 1024 ? this.md : this._class;
    this._class = width < 768 ? this.sm : this._class;
    this._class = width <= 414 ? this.xs : this._class;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.refresh(window.innerWidth, window.innerHeight);
    }, 10);
  }

}
