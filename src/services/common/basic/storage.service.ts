import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly EXPIRATION_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

  constructor() { }

  public set(key: string, value: any, expiration?: StorageExpirationConfiguration): void {
    const encodedValue = btoa(encodeURIComponent(JSON.stringify(value)));
    const storageObject = {
      value: encodedValue,
      expiration: expiration ? this.calculateExpiration(expiration) : null
    };
    localStorage.setItem(key, JSON.stringify(storageObject));
  }

  public get(key: string): any {
    const storageItem = localStorage.getItem(key);
    if (!storageItem) {
      return null;
    }

    const { value, expiration } = JSON.parse(storageItem);
    if (expiration && moment().isAfter(moment(expiration, this.EXPIRATION_FORMAT))) {
      this.delete(key);
      return null;
    }

    const decodedValue = decodeURIComponent(atob(value));
    return JSON.parse(decodedValue);
  }

  public delete(key: string): void {
    localStorage.removeItem(key);
  }

  public deleteKeysStartingWith(startingKey: string): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(startingKey)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
  }

  private calculateExpiration(expiration: StorageExpirationConfiguration): string {
    const { value, timeUnit } = expiration;
    return moment().add(value, timeUnit).format(this.EXPIRATION_FORMAT);
  }

}



export interface StorageExpirationConfiguration {
  value: number;
  timeUnit: 'hours' | 'minutes' | 'seconds'
}
