import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { UserInfo } from '@common/authentication.extension.service';

import { Observable, catchError, tap } from 'rxjs';

import { saveAs } from 'file-saver';

import { CookiesService, TokenInfo } from './cookie.service';
import { LoggerService } from './logger.service';
import { RouterService } from './routes.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService,
    private cookieService: CookiesService<UserInfo>,
    private routesService: RouterService,
  ) { }


  /**
   * Guarda el token de autenticación en la cookie de la aplicación.
   * @param token - El token de autenticación.
   */
  setToken(token: TokenInfo): void {
    this.loggerService.log(`[HttpService] Saving Token:`, token);
    this.cookieService.setAuthenticationToken(token);
  }


  /**
  * Elimina el token de autenticación de la cookie de la aplicación.
  */
  removeToken() {
    this.cookieService.removeAuthenticationToken();
  }



  /**
   * Realiza una solicitud HTTP GET.
   * @param url - La URL a la que se enviará la solicitud.
   * @param params - Los parámetros de la solicitud.
   * @returns Un objeto Observable que emite la respuesta de la solicitud.
   */
  get<T>(url: string, allowAnonymous: boolean = false): Observable<T> {
    const headers = this.getHeaders(allowAnonymous);
    this.logRequest(HttpVerbsEnum.GET, url, headers);
    return this.http.get<T>(url, { headers })
      .pipe(
        tap(response => {
          if (response) {
            this.logResponse(HttpVerbsEnum.GET, url, headers, response);
          }
        }),
        this.catchError(allowAnonymous)
      );
  }


  /**
   * Realiza una solicitud HTTP POST.
   * @param url - La URL a la que se enviará la solicitud.
   * @param params - Los parámetros de la solicitud.
   * @param allowAnonymous - Permite peticiones sin token en encabezados de respuesta default (false).
   * @returns Un objeto Observable que emite la respuesta de la solicitud.
   */
  post<T>(url: string, params?: any, allowAnonymous: boolean = false): Observable<T> {
    const headers = this.getHeaders(allowAnonymous);
    this.logRequest(HttpVerbsEnum.POST, url, headers, params);

    return this.http.post<T>(url, params, { headers })
      .pipe(
        tap(response => {
          this.logResponse(HttpVerbsEnum.POST, url, headers, response);
        }),
        this.catchError(allowAnonymous)
      );
  }

  /**
 * Realiza una solicitud HTTP PUT.
 * @param url - La URL a la que se enviará la solicitud.
 * @param params - Los parámetros de la solicitud.
 * @returns Un objeto Observable que emite la respuesta de la solicitud.
 */
  put<T>(url: string, params?: any): Observable<T> {
    const headers = this.getHeaders();
    this.logRequest(HttpVerbsEnum.PUT, url, headers, params);

    return this.http.put<T>(url, params, { headers })
      .pipe(
        tap(response => {
          this.logResponse(HttpVerbsEnum.PUT, url, headers, response);
        }),
        this.catchError()
      );
  }

  /**
  * Realiza una solicitud HTTP DELETE.
  * @param url - La URL a la que se enviará la solicitud.
  * @param params - Los parámetros de la solicitud.
  * @returns Un objeto Observable que emite la respuesta de la solicitud.
  */
  delete(url: string): Observable<void> {
    const headers = this.getHeaders();
    this.logRequest(HttpVerbsEnum.DELETE, url, headers);

    return this.http.delete<void>(url, { headers })
      .pipe(
        tap(response => {
          this.logResponse(HttpVerbsEnum.DELETE, url, headers, response);
        }),
        this.catchError()
      );
  }


  /**
   * Realiza una solicitud HTTP GET.
   * @param url - La URL a la que se enviará la solicitud.
   * @param params - Los parámetros de la solicitud.
   * @returns Un objeto Observable que emite la respuesta de la solicitud.
   */
  export<Blob>(url: string, allowAnonymous: boolean = false, extension: string = 'xlsx'): Observable<any> {
    // Creamos un objeto HttpHeaders para definir los encabezados de la solicitud HTTP.
    const headers = this.getBlobHeaders(allowAnonymous);

    this.logRequest(HttpVerbsEnum.GET, url, headers);
    return this.http.get<Blob>(url, { headers: headers, responseType: 'blob' as 'json' })
      .pipe(
        tap((blob: any) => {
          if (blob) {
            // Obtenemos el tamaño en bytes del Blob
            const sizeInBytes = (blob as any).size;
            this.logResponse(HttpVerbsEnum.GET, url, headers, `${sizeInBytes} bytes`);

            // Obtener la última parte de la URL como nombre
            const urlParts = location.href.split('/');
            const lastPart = urlParts[urlParts.length - 1];

            // Generar el GUID
            const guid = this.generateGUID();

            // Obtener el nombre del archivo
            const fileName = `${lastPart}_export_${guid}.${extension}`;

            saveAs(blob, fileName);
          }
        }),
        this.catchError(allowAnonymous)
      );
  }


  /**
   * Realiza una solicitud HTTP GET.
   * @param url - La URL a la que se enviará la solicitud.
   * @param params - Los parámetros de la solicitud.
   * @returns Un objeto Observable que emite la respuesta de la solicitud.
   */
  download<Blob>(url: string, fileName: string, allowAnonymous: boolean = false): Observable<any> {
    // Creamos un objeto HttpHeaders para definir los encabezados de la solicitud HTTP.
    const headers = this.getBlobHeaders(allowAnonymous);

    this.logRequest(HttpVerbsEnum.GET, url, headers);
    return this.http.get<Blob>(url, { headers: headers, responseType: 'blob' as 'json' })
      .pipe(
        tap((blob: any) => {
          if (blob) {
            // Obtenemos el tamaño en bytes del Blob
            const sizeInBytes = (blob as any).size;
            this.logResponse(HttpVerbsEnum.GET, url, headers, `${sizeInBytes} bytes`);
            saveAs(blob, fileName);
          }
        }),
        this.catchError(allowAnonymous)
      );
  }

  /**
   * Maneja el error de no autorización
   * @returns
   */
  private catchError<T>(allowAnonymous: boolean = false) {
    return catchError<T, Observable<T>>(err => {
      this.logError(err);
      if (err && err.status && err.status === 401 && this.cookieService.isTokenExpired() && allowAnonymous === false) {
        throw new HttpUnAuthorizedException();
      }
      else {
        throw err.error;
      }
    });
  }

  /**
  * Retorna los encabezados para la solicitud HTTP.
  * @returns Los encabezados para la solicitud HTTP.
  */
  private getHeaders(isAnonymous: boolean = false): HttpHeaders {
    return this.getAuthenticationHeaders(new HttpHeaders(), isAnonymous);
  }

  /**
  * Retorna los encabezados para la solicitud HTTP que retorno un archivo blob u octect stream.
  * @returns Los encabezados para la solicitud HTTP.
  */
  private getBlobHeaders(isAnonymous: boolean = false): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/octet-stream'
    });
    return this.getAuthenticationHeaders(headers, isAnonymous);
  }

  /**
   * Completa los encabezados de parámetro con el encabezado Authorization Bearer
   * @param headers - Los encabezados que desean completar con el encabezado Authorization
   * @param isAnonymous - Bandera de si es petición anónima o no
   * @returns - Un objeto de encabezados HttpHeaders con Authorization Bearer
   */
  private getAuthenticationHeaders(headers: HttpHeaders, isAnonymous: boolean) {
    const tokenExpired = this.cookieService.isTokenExpired();
    // this.loggerService.log(`[HttpService] ExpiredToken: ${tokenExpired}, Anonymous: ${isAnonymous}`);
    if (isAnonymous === false && tokenExpired === false) {
      headers = headers.append('Authorization', `Bearer ${this.cookieService.AuthenticationToken}`);
    }
    else if (isAnonymous === false) {
      this.cookieService.removeAuthenticationToken();
      this.cookieService.removeUserInfo();
      this.routesService.goToLogin();
    }
    return headers;
  }


  /**
   * Registra la solicitud HTTP en el servicio de registro.
   * @param method - El método HTTP de la solicitud.
   * @param url - La URL de la solicitud.
   * @param headers - Los encabezados de la solicitud.
   * @param body - El cuerpo de la solicitud.
   */
  private logRequest(method: string, url: string, headers: HttpHeaders, body?: any) {
    let request = {
      method: method,
      url: url,
      headers: headers,
      body: body || 'Empty Body'
    }

    /* Logging a request made by the HttpService with the method, URL, headers, and body as parameters.
    The `loggerService` is a custom service used for logging in the application. The `log` method is
    called with a string template literal that includes an emoji and an arrow symbol to indicate
    that it is a request being logged. */
    this.loggerService.log(`☝🏼🔺 [HttpService]`, request);
  }

  /**
 * Registra la respuesta de la solicitud HTTP en el servicio de registro.
 * @param method - El método HTTP de la solicitud.
 * @param url - La URL de la solicitud.
 * @param headers - Los encabezados de la solicitud.
 * @param response - La respuesta del servidor
 */
  private logResponse(method: string, url: string, headers: HttpHeaders, response?: any) {
    let httpResponse = {
      method: method,
      url: url,
      response: response
    }

    this.loggerService.log(`👇🏼🚨 [HttpService]:\r\n`, httpResponse);
  }

  /**
   * Registra el error de la solicitud HTTP en el servicio de registro.
   * @param error - El error de la solicitud HTTP.
   */
  logError(error: any) {
    this.loggerService.logError(error);
  }

  private generateGUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


}


export enum HttpVerbsEnum {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface IHttpException {
  status: number;
}

export class HttpUnAuthorizedException implements IHttpException {

  status: number = 401;

  constructor() {

  }
}
