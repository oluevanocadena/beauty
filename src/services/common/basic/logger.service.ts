import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  private _debug: boolean = false;

  constructor() {
  }

  public set debug(value: boolean) {
    this._debug = value;
  }

  log(...args: any[]) {
    if (this._debug) {
      console.log(...args);
    }
  }

  logError(error: any) {
    if (this._debug) {
      console.error(error);
    }
  }

  logTrace(trace: string) {
    if (this._debug) {
      console.trace(trace);
    }
  }

}
