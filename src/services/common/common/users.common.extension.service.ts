import { StorageService } from "@basic/storage.service";

import { Observable } from 'rxjs';

import { HttpService } from "../basic/http.service";

import { CommonExtensionService, HttpConfigurationCache } from "./common.extension.service";

export class UsersCommonService<TUser> extends CommonExtensionService<TUser> {

  constructor(public override httpService: HttpService, public override storageService: StorageService, protected override configurationCache: HttpConfigurationCache) {
    super(httpService, storageService, configurationCache);
  }

  /**
   * @section Image Profile methods
   * This section contains email methods.
   */

  /**
   * Método que se encarga de actualizar la imagen de perfil
   * @param user Objeto User que contiene la información del usuario a actualizar.
   * @return Observable que emite un valor de tipo void cuando la solicitud es completada.
   */
  updateImage(user: TUser): Observable<void> {
    return this.httpService.post<void>(`${this.urlApi}/update/imageprofile`, user);
  }



  /**
   * @section Password methods
   * This section contains password methods.
   */

  /**
  * Envía correo electrónico para recuperar el email.
  * @param email - Email de cliente.
  * @returns Observable<boolean> con la respuesta del servidor.
  */
  recoverPassword(input: UserPasswordChangeRequest): Observable<void> {
    return this.httpService.post<void>(`${this.urlApi}/password/recover/`, input, true);
  }

  /**
* Envía correo electrónico para recuperar el email.
* @param email - Email de cliente.
* @returns Observable<boolean> con la respuesta del servidor.
*/
  recoverPasswordConfirm(input: CredentialsInfo): Observable<void> {
    return this.httpService.post<void>(`${this.urlApi}/password/confirm/change`, input, true);
  }

  /**
   * Método que confirma el cambio de contraseña de un usuario.
   * @param user Objeto User que contiene la información del usuario a actualizar.
   * @return Observable que emite un valor de tipo void cuando la solicitud es completada.
   */
  changePassword(user: TUser): Observable<void> {
    return this.httpService.post<void>(`${this.urlApi}/password/change`, user);
  }




  /**
  * @section Email methods
  * This section contains email methods.
  */


  /**
   * Método que se encarga de solicitar el cambio de contraseña de un usuario.
   * @param request Objeto User que contiene la información del usuario a actualizar.
   * @return Observable que emite un valor de tipo void cuando la solicitud es completada.
   */
  requestChangeEmail(request: UserEmailChangeRequest): Observable<void> {
    return this.httpService.post<void>(`${this.urlApi}/email/change`, request);
  }

  /**
   * Método que se encarga de solicitar el cambio de correo electrónico de un usuario.
   * @param GUID - GUID del usuario que se desea enviar la solicitud.
   * @return Observable que emite un valor de tipo void cuando la solicitud es completada.
   */
  confirmChangeEmail(GUID: string): Observable<void> {
    return this.httpService.get<void>(`${this.urlApi}/email/change/confirm/${encodeURIComponent(GUID)}`, true);
  }



  /**
   * @section Register methods
   * This section contains register methods.
   */


  /**
   * Método que envia una nueva solicitud de correo de confirmación de registro.
   * @param GUID - GUID del usuario que se desea enviar la solicitud.
   * @return Observable que emite un valor de tipo void cuando la solicitud es completada.
   */
  resendEmailRegister(GUID: string): Observable<void> {
    return this.httpService.get<void>(`${this.urlApi}/email/register/resend/${encodeURIComponent(GUID)}`);
  }

  /**
   * Confirma el registro de usuario cambiando su bandera de validación y devuelve un Observable con la respuesta del servidor.
   * @param GUID - GUID del usuario que se desea enviar la confirmación.
   * @returns Observable con la respuesta del servidor.
   */
  confirmEmailRegister(GUID: string): Observable<void> {
    return this.httpService.get<void>(`${this.urlApi}/email/register/confirm/${encodeURIComponent(GUID)}`, true);
  }


}

export interface IUser {
  Id?: number;
  GUID?: string;
  CreationDate?: string;

  Subscriber?: any;
  FullName?: string;

  FirstName?: string,
  LastName?: string,
  UserEmail?: string,
  Phone?: string;
  Password?: string,
  OldPassword?: string;
  BusinessInfo?: IBusinessInfo;

  IsDeleted?: boolean;
  UpdatedAt?: string;
}

export interface IBusinessInfo {
  Id?: number;
  GUID?: string;
  CreationDate?: string;

  BrandName: string;
  Phone: string;
  Address?: Address;
  ImageBrandUrl?: string;

  IsDeleted?: boolean;
  UpdatedAt?: string;
}

export interface UserEmailChangeRequest {
  Id?: number;
  GUID?: string;
  CreationDate?: string;

  UserGUID: string;
  NewEmail: string;
  ExpirationDate?: string;
  Changed?: string;

  IsDeleted?: boolean;
  UpdatedAt?: string;
}

export interface UserPasswordChangeRequest {

  Id?: number;
  GUID?: string;
  CreationDate?: string;

  UserGUID?: string;
  UserEmail: string;
  ExpirationDate?: string;
  Recovered?: string;

  IsDeleted?: boolean;
  UpdatedAt?: string;
}


export interface CredentialsInfo {
  GUID: String;
  NewPassword: String;
}


export interface Address {
  Street: string;
  ExternalNumber: string;
  InternalNumber: string;
  Suburb: string;
  Municipality: string;
  State: string;
  ZipCode: string;
  Country?: string;
  CountryCode: string;

  FormattedAddress?: string;
  Latitude?: number;
  Longitude?: number;

  IsDeleted?: boolean;
  UpdatedAt?: string;
  IsDefault?: string;
}
