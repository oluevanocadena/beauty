import { Component, HostListener } from "@angular/core";

import { assets, environment } from "src/environments/environment";

@Component({
  template: '<ng-content></ng-content>',
  styles: ['']
})
export class HelperPage {

  readonly environment = environment;
  readonly assets = assets;

  isMobile: boolean = false;
  isMobileOrTablet: boolean = false;
  isDesktopOrLaptop: boolean = false;
  isDesktopOrLargeDesktop: boolean = false;
  isLargeDesktop: boolean = false;

  isAppleDevice: boolean = false;

  public widthWindow: number;
  public heightWindow: number;

  private _lastWidth: number = 0;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.widthWindow = event.target.innerWidth;
    this.heightWindow = event.target.innerHeight;
    this.evaluateWidthDevice(this.widthWindow);
  }

  constructor(

  ) {
    this.widthWindow = window.innerWidth;
    this.heightWindow = window.innerHeight;
    this.evaluateWidthDevice(window.innerWidth);
    this.checkDevice();
  }

  public checkDevice() {
    const userAgent = window.navigator.userAgent;
    this.isAppleDevice = /iPhone/.test(userAgent) || /iPad/.test(userAgent) || /Safari/.test(userAgent) && !/Chrome/.test(userAgent) && !/Edge/.test(userAgent);
  }

  public evaluateWidthDevice(width: number) {
    if (this._lastWidth === width) return;
    this.isMobile = width <= 414;
    this.isMobileOrTablet = width < 768;
    this.isDesktopOrLaptop = width >= 768 && width < 1024
    this.isDesktopOrLargeDesktop = width > 1024;
    this.isLargeDesktop = width > 1366;
    this._lastWidth = width;
  }

}
