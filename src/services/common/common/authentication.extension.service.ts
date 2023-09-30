import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, Observable, tap } from 'rxjs';
import { CookiesService } from '../basic/cookie.service';
import { HttpService } from '../basic/http.service';
import { LoggerService } from '../basic/logger.service';
import { MessageService } from '../basic/message.service';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { RouterService } from '../basic/routes.service';

@Injectable({
  providedIn: 'root'
})
export class CommonAuthenticationService<TUser> {

  protected serviceBusy = false;
  protected urlApi: string;

  /**
   * Constructor de la clase AuthenticationService.
   * @param httpService - Servicio HTTP que se utilizará para realizar las peticiones.
   */
  constructor(
    public httpService: HttpService,
    public cookiesService: CookiesService<UserInfo>,
    public loggerService: LoggerService,
    public messageService: MessageService,
    public tuiAlertService: TuiAlertService,
    public router: Router,
    public routesService: RouterService,
  ) { }

  /**
    * Método que establece la url de API para este servicio
    * @param url | Es la url base a la que apuntara el servicio de plantillas.
    */
  public setApiURL(url: string) {
    this.urlApi = `${url}`;
  }

  /**
   * Autentica al usuario y devuelve un Observable con la respuesta del servidor.
   * @param user - Usuario y contraseña a autenticar.
   * @returns Observable con la respuesta del servidor.
   */
  public authenticate(user: TUser) {
    return this.httpService.post<UserInfo>(`${this.urlApi}/authenticate`, user, true).pipe(
      tap((response: UserInfo) => {
        this.httpService.setToken({ Token: response.Token, TokenExpirationDate: response.TokenExpirationDate });
        this.cookiesService.setUserInfo(response);
      })
    );
  }

  /**
   * Actualiza la información de usuario en la cookie
   * @param user - Usuario y contraseña a autenticar.
   * @returns
   */
  public refreshUserInfo() {
    return this.httpService.get<UserInfo>(`${this.urlApi}/get/userinfo`).pipe(
      tap((response: UserInfo) => {
        this.httpService.setToken({ Token: response.Token, TokenExpirationDate: response.TokenExpirationDate });
        this.cookiesService.setUserInfo(response);
      })
    );
  }

  /**
   * Finaliza la autenticación del usuario y borra la cookie de información de usuario.
   * @returns Observable con la respuesta booleana del servidor.
   */
  public logout() {
    this.serviceBusy = true;
    const alertMessage = this.messageService.getMessage('ALERT_SAVE_ERROR');
    return new Observable(observer => {
      return this.httpService.post<void>(`${this.urlApi}/logout`, undefined, false).pipe(catchError(error => {
        (this.tuiAlertService as any).open(alertMessage.message, { label: alertMessage.title, status: TuiNotification.Error }).subscribe();
        throw error;
      }), finalize(() => {
        this.serviceBusy = false;
      })).subscribe(() => {
        this.removeUserInfo();
        observer.next();
        observer.complete();
      });
    });
  }

  /**
  * Refresca el token de autenticación del usuario y devuelve un Observable con la respuesta del servidor.
  * @param user - Usuario y token de autenticación a refrescar.
  * @returns Observable con la respuesta del servidor.
  */
  public refreshtoken(): Observable<string> {
    return this.httpService.post<string>(`${this.urlApi}/refreshtoken`);
  }

  /**
   * Revoca el token de autenticación del usuario y devuelve un Observable con la respuesta del servidor.
   * @param user - Usuario y token de autenticación a revocar.
   * @returns Observable con la respuesta del servidor.
   */
  public revokehtoken(): Observable<void> {
    return this.httpService.post<void>(`${this.urlApi}/revokehtoken`);
  }

  /**
   * Registra al usuario y devuelve un Observable con la respuesta del servidor.
   * @param user - Usuario y contraseña a registrar.
   * @returns Observable con la respuesta del servidor.
   */
  public register(user: TUser): Observable<void> {
    return this.httpService.post<void>(`${this.urlApi}/register`, user, true);
  }

  /**
  * Obtiene el código QR para la autenticación de doble factor y devuelve un Observable con la respuesta del servidor.
  * @returns Observable con la respuesta del servidor.
  */
  public getMfaQRCode(): Observable<TUser> {
    return this.httpService.post<TUser>(`${this.urlApi}/mfa/getqrcode`);
  }

  /**
   * Valida el código de autenticación de doble factor y devuelve un Observable con la respuesta del servidor.
   * @param code - Código de autenticación de doble factor a validar.
   * @returns Observable con la respuesta del servidor.
   */
  public validateMfaCode(code: string): Observable<TUser[]> {
    return this.httpService.post<TUser[]>(`${this.urlApi}/mafa/validatemfacode`, code);
  }

  /**
   * Comprueba si el usuario ha iniciado sesión y si su token de autenticación sigue siendo válido.
   * @returns Un valor booleano que indica si el usuario ha iniciado sesión y su token de autenticación sigue siendo válido (`true`) o no (`false`).
   */
  public isLoggedIn(): boolean {
    const userInfo: UserInfo = this.cookiesService.UserInfo;
    if (userInfo) {
      const isTokenExpired = this.cookiesService.isTokenExpired();
      const isLoggedIn = isTokenExpired === false && !!userInfo.Token;
      this.loggerService.log('[AuthenticationService] LoginState', isLoggedIn, 'IsTokenExpired', isTokenExpired);
      return isLoggedIn;
    }
    else {
      return false;
    }
  }

  /**
   * Comprueba si el usuario ha iniciado sesión y si tiene un rol específico asignado en su objeto `UserInfo`.
   * @param role - Un valor `UserRolesEnum` que especifica el rol que se debe comprobar.
   * @returns Un valor booleano que indica si el usuario ha iniciado sesión y tiene el rol especificado (`true`) o no (`false`).
   */
  public hasRole(role: UserRolesEnum): boolean {
    const userInfo: UserInfo = this.cookiesService.UserInfo;
    if (userInfo && userInfo.UserRoles && userInfo.UserRoles.map(x => x.RoleId.toString()).includes(role.toString())) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * Remove the user information on cookies and local storage
   */
  public removeUserInfo() {
    this.cookiesService.removeUserInfo();
    this.cookiesService.removeAuthenticationToken();
  }


}



export interface UserInfo {
  UserGUID: string;
  BusinessInfoGUID: string;
  BusinessName?: string;
  ImageProfileUrl: string;
  UserEmail: string;
  FullName: string;
  Token?: string;
  TokenExpirationDate?: string;
  UserRoles?: UserRole[];
  UserRolesGUID?: string;
}

export interface UserRole {
  Id?: number;
  GUID?: string;
  RoleId: number;
  CreationDate: string;
  UserGUID: string;
  RoleName?: string;

  IsDeleted?: boolean;
  UpdatedAt?: string;
}

export enum UserRolesEnum {
  Admin = 1,
  Customer = 2,
}
