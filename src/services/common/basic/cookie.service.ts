import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';
import { StorageService } from './storage.service';
import * as moment from 'moment';
import { UserInfo } from '@common/authentication.extension.service';

/**
 * CookiesService proporciona métodos para guardar información segura de usuario y token de autenticación.
 * @returns void
 */
@Injectable({
  providedIn: 'root'
})
export class CookiesService<TUserInfo extends UserInfo> {
  private readonly TOKEN_COOKIE_NAME = 'auth_token';
  private readonly USER_COOKIE_NAME = 'user_info';


  constructor(
    private storageService: StorageService,
    private loggerService: LoggerService
  ) {

  }

  /**
   * Establece el token de autenticación en una cookie.
   * @param token el token de autenticación a establecer.
   * @returns void
   */
  setAuthenticationToken(token: TokenInfo) {
    const encryptedToken = btoa(JSON.stringify(token)); // descifra el token con base64
    this.storageService.set(this.TOKEN_COOKIE_NAME, encryptedToken);
  }


  /**
  * Obtiene el token de autenticación de una cookie.
  * @returns el token de autenticación si existe en una cookie, de lo contrario null.
  */
  get AuthenticationToken(): string {
    const tokenInfo: TokenInfo = JSON.parse(atob(this.storageService.get(this.TOKEN_COOKIE_NAME)));
    return tokenInfo.Token;
  }

  /**
  * Obtiene el token de autenticación de una cookie.
  * @returns el token de autenticación si existe en una cookie, de lo contrario null.
  */
  isTokenExpired(): boolean {
    const recoveredData = this.storageService.get(this.TOKEN_COOKIE_NAME);
    if (recoveredData && this.isJSON(atob(recoveredData)) === true) {
      const tokenInfo: TokenInfo = JSON.parse(atob(recoveredData));
      const result = moment().isAfter(moment(tokenInfo.TokenExpirationDate));
      return result;
    }
    else {
      return true;
    }
  }

  /**
  * Elimina la cookie de token de autenticación.
  * @returns void
  */
  removeAuthenticationToken(): void {
    this.storageService.delete(this.TOKEN_COOKIE_NAME);
  }


  /**
   * Establece la información del usuario en una cookie.
   * @param userInfo La información del usuario a establecer.
   * @returns void
  */
  setUserInfo(userInfo: TUserInfo): void {
    this.loggerService.log('[CookiesService] seting user Info', userInfo);
    this.storageService.set(this.USER_COOKIE_NAME, userInfo);
  }


  /**
  * Obtiene la información del usuario de una cookie.
  * @returns La información del usuario si existe en una cookie, de lo contrario null.
  */
  get UserInfo(): TUserInfo {
    return this.storageService.get(this.USER_COOKIE_NAME);
  }

  /**
  * Elimina la cookie de información de usuario.
  * @returns void
  */
  removeUserInfo(): void {
    this.storageService.delete(this.USER_COOKIE_NAME);
  }


  private isJSON(obj: string): boolean {
    try {
      JSON.parse(obj);
      return true;
    } catch (e) {
      return false;
    }
  }


}


export interface TokenInfo {
  Token: string;
  TokenExpirationDate: string;
}

