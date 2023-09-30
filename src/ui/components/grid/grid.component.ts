import { Component, HostBinding, HostListener, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class UIGridComponent {

  private sizeXS: boolean = false;
  private sizeSM: boolean = false;
  private sizeMD: boolean = false;
  private sizeLG: boolean = false;
  private sizeXL: boolean = false;

  public isMobile: boolean = false;
  public isMobileOrTablet: boolean = false;
  public isDesktopOrLaptop: boolean = false;
  public isDesktopOrLargeDesktop: boolean = false;
  public isLargeDesktop: boolean = false;

  private _style: SafeStyle;
  private _gap: Array<number> = [];
  private _contentMode = 'max-content';
  private _canDisplay: boolean = true;

  private colGap = '0px';
  private rowGap = '0px';
  private _lastWidth: number = 0;

  // GAP
  @Input() set gap(gap) {
    this._gap = gap || [];
    if (gap.length > 0) {
      this.rowGap = `${gap[0] > 0 ? gap[0] : 0}px`;
      this.colGap = `${gap[1] > 0 ? gap[1] : 0}px`;
    }
  };
  get gap() { return this._gap };


  // Generals
  @Input() direction: 'left-top' | 'top-center' | 'right-top' | 'left-center' | 'center-center' | 'right-center' | 'left-bottom' | 'bottom-center' | 'right-bottom' = 'left-center';
  @Input() height = 'auto';
  @Input() maxHeight = 'auto';
  @Input() maxWidth = 'auto';
  @Input() minHeight = 'auto';
  @Input() minWidth = 'auto';
  @Input() mode: 'grid' | 'flex' = 'grid';
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';
  @Input() padding = '0';
  @Input() position = 'relative';
  @Input() rounded = 0;
  @Input() skeleton: boolean = false;
  @Input() skeletonRounded = false;
  @Input() skeletonWidth = 'auto';
  @Input() templateColumn: string;
  @Input() templateRow = '';
  @Input() width = 'auto';
  @Input() wrap: boolean = false;
  @Input() columns: number = 1;

  // Size Screens
  @Input() xs: any;
  @Input() sm: any;
  @Input() md: any;
  @Input() lg: any;
  @Input() xl: any;

  @Input() hxs: boolean = false;
  @Input() hsm: boolean = false;
  @Input() hmd: boolean = false;
  @Input() hlg: boolean = false;
  @Input() hxl: boolean = false;


  //Host Bindings
  @HostBinding('style') get style() { return this._style; }
  @HostBinding('class.tui-skeleton_rounded') get skeletonRoundedClass(): boolean {
    return this.skeleton && this.skeletonRounded;
  }
  @HostBinding('class.rounded') get skRoundedClass(): boolean {
    return this.skeleton && this.skeletonRounded;
  }
  @HostBinding('class.tui-skeleton') get skeletonClass(): boolean {
    return this.skeleton;
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: any) {
    this.refresh(event.target.innerWidth, event.target.innerHeight);
  }


  constructor(
    private sanitizer: DomSanitizer
  ) {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.refresh(window.innerWidth, window.innerHeight);
    }, 10);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.sm = this.sm || this.xs;
    this.md = this.md || this.sm;
    this.lg = this.lg || this.md;
    this.xl = this.xl || this.lg;
    this.refresh(window.innerWidth, window.innerHeight);
  }

  public createStyle(templateColumn: string) {
    let style: string = '';
    if (this.mode === 'grid') {
      style = `
          display: ${this._canDisplay === false ? 'none' : 'grid'};
          grid-auto-rows: ${this._contentMode};
          grid-column-gap: ${this.colGap};
          grid-row-gap: ${this.rowGap};
          grid-template-columns: ${this.orientation === 'vertical' ? templateColumn : '1fr'};
          grid-template-rows: ${this.templateRow};
          padding: ${this.padding};
          width: ${this.skeleton ? this.skeletonWidth : this.width};
          height: ${this.height};
          max-height: ${this.maxHeight};
          max-width: ${this.maxWidth};
          min-height: ${this.minHeight};
          min-width: ${this.minWidth};
          position: ${this.position};
          border-radius: ${this.rounded}px;
      `;
    }
    else if (this.mode === 'flex') {
      let centers = ['top-center', 'center-center', 'bottom-center'];
      let side = this.direction.split('-')[0];
      let alignment = this.direction.split('-')[1];
      let justify = side === 'left' ? 'flex-start' : side === 'right' ? 'flex-end' : (side === 'center' ? (alignment === 'top' ? 'flex-start' : alignment === 'bottom' ? 'flex-end' : 'center') : 'flex-start');
      let alignItems = (side === 'left' || side === 'right') && alignment === 'top' ? 'flex-start' : (side === 'left' || side === 'right') && alignment === 'bottom' ? 'flex-end' : 'center';
      style = `
          display: ${this._canDisplay === false ? 'none' : 'flex'};
          flex-direction: ${centers.includes(this.direction) === true ? 'column' : 'row'};
          justify-content: ${justify};
          align-items: ${alignItems};
          flex-wrap: ${this.wrap === true ? 'wrap' : 'nowrap'};
          column-gap: ${this.colGap};
          row-gap: ${this.rowGap};
          padding: ${this.padding};
          width: ${this.skeleton ? this.skeletonWidth : this.width};
          height: ${this.height};
          max-height: ${this.maxHeight};
          max-width: ${this.maxWidth};
          min-height: ${this.minHeight};
          min-width: ${this.minWidth};
          position: ${this.position};
          border-radius: ${this.rounded}px;
      `;
    }
    let styleSafe: SafeStyle = this.sanitizer.bypassSecurityTrustStyle(style);
    if (this._style !== styleSafe) {
      this._style = style;
    }
  }

  public validateTemplate() {
    let hasResponsive = !!this.xs || !!this.sm || !!this.md || !!this.lg || !!this.xl;
    let templateCol = '';
    if (this.templateColumn) {
      templateCol = this.templateColumn;
    }
    else {
      if (hasResponsive) {
        templateCol = (this.sizeXL && this.xl) ? this.xl : (this.sizeLG && this.lg) ? this.lg : (this.sizeMD && this.md) ? this.md : (this.sizeSM && this.sm) ? this.sm : (this.sizeXS && this.xs) ? this.xs : this.columns > 0 ? `repeat(${this.columns}, 1fr)` : 'auto';
      }
      else {
        templateCol = this.columns > 0 ? `repeat(${this.columns}, 1fr)` : 'auto';
      }
    }
    this.createStyle(templateCol);
  }

  public evaluateHideWidthDevice() {
    this.hxs = this.sizeXS === true ? true : this.hxs;
    this.hsm = this.sizeSM === true ? true : this.hsm;
    this.hmd = this.sizeMD === true ? true : this.hmd;
    this.hlg = this.sizeLG === true ? true : this.hlg;
    this.hxl = this.sizeXL === true ? true : this.hxl;
  }


  public refresh(width: number, height: number) {
    this.evaluateWidthDevice(width, height);
    this.evaluateHideWidthDevice();
    this.validateTemplate();
  }

  public evaluateWidthDevice(width: number, height: number) {

    if (this._lastWidth === width)
      return;

    this.sizeXL = width >= 1366 ? true : false;
    this.sizeLG = width >= 1025 && width < 1366 ? true : false;
    this.sizeMD = width >= 768 && width <= 1024 ? true : false;
    this.sizeSM = width < 768 ? true : false;
    this.sizeXS = width <= 414 ? true : false;

    this.isMobile = window.innerWidth > 414 === false;
    this.isMobileOrTablet = window.innerWidth > 768 === false;
    this.isDesktopOrLaptop = (window.innerWidth < 1024 && window.innerWidth < 1024 || window.innerWidth >= 1366) === false;
    this.isDesktopOrLargeDesktop = window.innerWidth < 1024 === false;
    this.isLargeDesktop = window.innerWidth < 1366 === false;

    this._lastWidth = width;
  }



}

