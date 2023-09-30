import { Directive, TemplateRef, ViewContainerRef, HostListener, Input } from '@angular/core';

@Directive({})
export abstract class BaseHideDirective {

  @Input() set condition(value: boolean) {
    if (value !== null) {
      this._condition = value;
      this.toggleView();
    }
  }
  private _condition: boolean | null = null;

  protected abstract checkSize(): boolean;

  private hasView = false;

  constructor(
    protected templateRef: TemplateRef<any>,
    protected viewContainer: ViewContainerRef
  ) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.toggleView();
  }

  ngOnInit() {
    this.toggleView();
  }

  private toggleView() {
    const sizeCondition = this.checkSize();
    const shouldBeVisible = this._condition !== null ? this._condition : sizeCondition;

    if (shouldBeVisible && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!shouldBeVisible && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}


@Directive({
  selector: '[hideXS]'
})
export class HideXSDirective extends BaseHideDirective {
  protected checkSize(): boolean {
    return window.innerWidth > 414;
  }
}

@Directive({
  selector: '[hideSM]'
})
export class HideSMDirective extends BaseHideDirective {
  protected checkSize(): boolean {
    return window.innerWidth <= 414 || window.innerWidth >= 768;
  }
}

@Directive({
  selector: '[hideMD]'
})
export class HideMDirective extends BaseHideDirective {
  protected checkSize(): boolean {
    return window.innerWidth < 768 || window.innerWidth >= 1025;
  }
}

@Directive({
  selector: '[hideLG]'
})
export class HideLGDirective extends BaseHideDirective {
  protected checkSize(): boolean {
    return window.innerWidth < 1025 || window.innerWidth >= 1366;
  }
}

@Directive({
  selector: '[hideXL]'
})
export class HideXLDirective extends BaseHideDirective {
  protected checkSize(): boolean {
    return window.innerWidth < 1366;
  }
}


/**
 * Screens Devices
 */

@Directive({
  selector: '[hideOnMobile]'
})
export class HideOnMobileDirective extends BaseHideDirective {
  protected checkSize(): boolean {
    return window.innerWidth > 414;
  }
}

@Directive({
  selector: '[hideMobileOrTablet]'
})
export class HideMobileOrTabletDirective extends BaseHideDirective {
  protected checkSize(): boolean {
    return window.innerWidth > 768;
  }
}

@Directive({
  selector: '[hideDesktopOrLaptop]'
})
export class HideDesktopOrLaptopDirective extends BaseHideDirective {
  protected checkSize(): boolean {
    return window.innerWidth < 1024 || window.innerWidth >= 1366;
  }
}

@Directive({
  selector: '[hideDesktopOrLargeDesktop]'
})
export class HideDesktopOrLargeDesktopDirective extends BaseHideDirective {
  protected checkSize(): boolean {
    return window.innerWidth < 1024;
  }
}

@Directive({
  selector: '[hideLargeDesktop]'
})
export class HideLargeDesktopDirective extends BaseHideDirective {
  protected checkSize(): boolean {
    return window.innerWidth < 1366;
  }
}
