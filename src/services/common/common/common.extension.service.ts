import { Injectable } from '@angular/core';

import { StorageExpirationConfiguration, StorageService } from '@basic/storage.service';

import { Observable, of, tap } from 'rxjs';

import { HttpService } from "../basic/http.service";

@Injectable({
  providedIn: 'root'
})
export class CommonExtensionService<T> {

  protected urlApi: string;

  // Cache
  protected cache: Cache<T> = {};
  protected defaultCache: Cache<T> = {};
  protected queryCache: Cache<Array<T>> = {};
  protected searchCache: Cache<Array<T>> = {};

  constructor(
    public httpService: HttpService,
    public storageService: StorageService,
    protected configurationCache: HttpConfigurationCache = {
      cacheableDataRetrieval: { get: false, search: false, query: false, getDefault: false },
      cacheExpiration: { shouldPersist: false, persistanceDuration: null }
    },
  ) {

  }

  /**
  * Método que establece la url de API para este servicio
  * @param url | Es la url base a la que apuntara el servicio de plantillas.
  */
  setApiURL(url: string) {
    this.urlApi = `${url}`;
  }

  /**
   * Envía un objeto a guardar en el servidor.
   * @param input El objeto que se enviará a guardar.
   * @returns Un observable que emite un valor booleano que indica si el objeto se guardó correctamente o no.
   */
  public inactive(GUID: string): Observable<T> {
    return this.httpService.post<T>(this.urlApi + `/inactive/${encodeURIComponent(GUID)}`).pipe(tap(response => {
      this.storageService.deleteKeysStartingWith(this.urlApi);
    }));
  }

  /**
   * Envía un objeto a guardar en el servidor.
   * @param input El objeto que se enviará a guardar.
   * @returns Un observable que emite un valor booleano que indica si el objeto se guardó correctamente o no.
   */
  public save(input: T): Observable<T> {
    return this.httpService.post<T>(this.urlApi + `/update`, input).pipe(
      tap(response => {
        this.storageService.deleteKeysStartingWith(this.urlApi);
      })
    );
  }

  /**
   * Recupera un objeto de caché del servidor.
   * @param GUID El GUID del objeto a recuperar.
   * @returns Un observable que emite los datos del objeto.
   */
  public get(GUID: string): Observable<T> {
    const cacheKey = `${this.urlApi}_${GUID}_get`;
    const url = this.createUrl(`get/guid/${encodeURIComponent(GUID)}`);

    this.validateCache(this.cache, this.configurationCache.cacheableDataRetrieval.get, cacheKey);

    if (this.configurationCache.cacheableDataRetrieval.get === true && GUID && this.cache[cacheKey]) {
      return of(JSON.parse(JSON.stringify(this.cache[cacheKey])) as T);
    }
    else {
      return this.httpService.get<T>(url).pipe(tap(data => {
        if (GUID) {
          this.cache[cacheKey] = data;
          if (this.configurationCache.cacheExpiration.shouldPersist && this.configurationCache.cacheableDataRetrieval.get) {
            this.storageService.set(cacheKey, data, this.configurationCache.cacheExpiration.persistanceDuration)
          }
        }
      }));
    }
  }

  /**
   * Recupera un objeto de caché del servidor.
   * @param GUID El GUID del objeto a recuperar.
   * @returns Un observable que emite los datos del objeto.
   */
  public getByToken(): Observable<T> {
    const url = this.createUrl(`get`);
    return this.httpService.get<T>(url);
  }

  /**
  * Recupera un objeto default de la api rest.
  * @returns Un observable que emite los datos del objeto.
  */
  public getDefault(): Observable<T> {
    const cacheKey = `${this.urlApi}_default`;
    const url = this.createUrl('get/default');

    this.validateCache(this.defaultCache, this.configurationCache.cacheableDataRetrieval.getDefault, cacheKey);

    if (this.configurationCache.cacheableDataRetrieval.getDefault === true && this.defaultCache[cacheKey]) {
      return of(JSON.parse(JSON.stringify(this.defaultCache[cacheKey])) as T);
    }
    else {
      return this.httpService.get<T>(url).pipe(tap(data => {
        this.defaultCache[cacheKey] = data;
        if (this.configurationCache.cacheExpiration.shouldPersist && this.configurationCache.cacheableDataRetrieval.getDefault) {
          this.storageService.set(cacheKey, data, this.configurationCache.cacheExpiration.persistanceDuration)
        }
      }));
    }
  }

  /**
   * Recupera un objeto de caché del servidor.
   * @param GUID El GUID del objeto a recuperar.
   * @returns Un observable que emite los datos del objeto.
   */
  public setDefault(GUID: string): Observable<void> {
    const url = this.createUrl(`set/default/${GUID}`);
    return this.httpService.get<void>(url);
  }

  /**
   * Elimina un objeto de caché del servidor.
   * @param GUID El GUID del objeto a eliminar.
   * @returns Un observable que emite un valor booleano que indica si la eliminación se realizó correctamente o no.
   */
  public delete(GUID?: string): Observable<void> {
    return this.httpService.delete(this.urlApi + `/delete/guid/${encodeURIComponent(GUID)}`).pipe(
      tap(() => {
        this.storageService.deleteKeysStartingWith(this.urlApi);
      })
    );
  }


  /**
   * Busca una plantilla por texto de búsqueda y cantidad máxima de resultados.
   * @param searchText Texto de búsqueda.
   * @param topRows Cantidad máxima de resultados.
   * @returns Observable que emite un arreglo de objetos <T> generic.
   */
  public search(searchText: string = '', topRows: number = 20): Observable<Array<T>> {

    const methodName = 'search';
    const params = { searchText, topRows };
    const cacheKey = this.createCacheKey(methodName, params);
    const url = this.createUrl(methodName, params);

    this.validateCache(this.searchCache, this.configurationCache.cacheableDataRetrieval.search, cacheKey);

    if (this.configurationCache.cacheableDataRetrieval.search === true && this.searchCache[cacheKey]) {
      return of(JSON.parse(JSON.stringify(this.searchCache[cacheKey])) as Array<T>);
    }
    else {
      return this.httpService.get<Array<T>>(url).pipe(tap((data: T[]) => {
        this.searchCache[cacheKey] = data;
        if (this.configurationCache.cacheExpiration.shouldPersist && this.configurationCache.cacheableDataRetrieval.search) {
          this.storageService.set(cacheKey, data, this.configurationCache.cacheExpiration.persistanceDuration);
        }
      }));
    }
  }

  /**
   * Realiza una consulta avanzada de usuarios.
   * @param searchText Texto de búsqueda.
   * @param startDate Fecha de inicio.
   * @param endDate Fecha de fin.
   * @param sortColumns Columnas por las que se debe ordenar la consulta.
   * @param sortType Tipo de ordenamiento (ASC o DESC).
   * @param page Número de página.
   * @param pageSize Cantidad de resultados por página.
   * @returns Observable que emite un arreglo de objetos <T> generic.
   */
  public query(searchText: string = '', startDate?: string, endDate?: string, sortColumns?: Array<string | number | symbol>, sortType: 'ASC' | 'DESC' = 'DESC', pageNumber: number = 20, pageSize: number = 50): Observable<Array<T>> {

    const methodName = 'query';
    const params = { searchText, startDate, endDate, sortColumns: sortColumns.join(','), sortType, pageNumber, pageSize };
    const cacheKey = this.createCacheKey(methodName, params);
    const url = this.createUrl(methodName, params);

    this.validateCache(this.queryCache, this.configurationCache.cacheableDataRetrieval.query, cacheKey);

    if (this.configurationCache.cacheableDataRetrieval.query === true && this.queryCache[cacheKey]) {
      return of(JSON.parse(JSON.stringify(this.queryCache[cacheKey])) as Array<T>);
    }
    else {
      return this.httpService.get<Array<T>>(url).pipe(tap(data => {
        this.queryCache[cacheKey] = data;
        if (this.configurationCache.cacheExpiration.shouldPersist && this.configurationCache.cacheableDataRetrieval.query) {
          this.storageService.set(cacheKey, data, this.configurationCache.cacheExpiration.persistanceDuration)
        }
      }));
    }
  }


  /**
  * Descarga un archivo desde el servidor.
  * @param searchText Texto de búsqueda.
  * @param startDate Fecha de inicio.
  * @param endDate Fecha de fin.
  * @param sortColumns Columnas por las que se debe ordenar la consulta.
  * @param sortType Tipo de ordenamiento (ASC o DESC).
  * @param pageNumber Número de página.
  * @param pageSize Cantidad de resultados por página.
  * @returns Observable que emite el archivo a descargar.
  */
  public export(searchText: string, startDate: string, endDate: string, sortColumns: Array<string | number | symbol>, sortType: 'ASC' | 'DESC', pageNumber: number, pageSize: number): Observable<Blob> {

    const params = { searchText, startDate, endDate, sortColumns: sortColumns.join(','), sortType, pageNumber, pageSize };
    const url = this.createUrl('export', params);

    return this.httpService.export<Blob>(url);
  }


  /**
   * @section Utils Methods
   */


  /**
   * Genera una cadena de consulta (query string) a partir de los parámetros especificados.
   * @param params Los parámetros para construir la cadena de consulta.
   * @returns La cadena de consulta generada.
   */
  protected createQueryString(params: Record<string, any>): string {

    const queryStringParams: string[] = [];

    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const value = params[key];

        // Validate empty values or null
        if (value !== undefined && value !== null && value !== '') {


          const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
          const encodedValue = encodeURIComponent(value);
          queryStringParams.push(`${capitalizedKey}=${encodedValue}`);
        }
      }
    }

    // Return created querystring
    return queryStringParams.join('&');
  }

  /**
   * Crea una URL para llamar al método especificado, opcionalmente con los parámetros indicados.
   * @param methodName El nombre del método.
   * @param params Los parámetros para incluir en la URL.
   * @returns La URL creada.
   */
  protected createUrl(methodName: string, params?: any) {

    // Generate the query string
    const queryString = params ? this.createQueryString(params) : '';

    //Join the url and querystring parameters
    const url = `${this.urlApi}/${methodName}?${queryString}`;

    // Return the created url
    return url;
  }

  /**
   * Crea una clave de caché a partir del nombre del método y los parámetros especificados.
   * @param methodName El nombre del método.
   * @param parameters Los parámetros para incluir en la clave de caché.
   * @returns La clave de caché generada.
   */
  protected createCacheKey(methodName: string, parameters: Record<string, any>): string {
    const cacheParams: string[] = [];

    for (const [key, value] of Object.entries(parameters)) {
      if (value !== undefined && value !== null && value !== '') {
        cacheParams.push(`${key}=${value}`);
      }
    }

    // Join the parameters values
    const cacheKey = `${this.urlApi}_${methodName}_${cacheParams.join('_')}`;

    // Eliminar espacios vacíos
    const cacheKeyWithoutSpaces = cacheKey.replace(/\s+/g, '');

    // Return generated cache key
    return cacheKeyWithoutSpaces;
  }

  /**
   * Carga el valor almacenado en la caché identificado por la clave especificada.
   * Si la opción de persistencia está habilitada y no se encuentra el valor en la caché local,
   * intenta recuperar el valor del almacenamiento persistente y lo guarda en la caché local.
   * @param cacheKey La clave que identifica el valor en la caché.
   */
  protected validateCache(cacheObject: any, cacheable: boolean, cacheKey: string) {
    if (this.configurationCache.cacheExpiration.shouldPersist === true && cacheable && !!!cacheObject[cacheKey]) {
      const recoveredValue = this.storageService.get(cacheKey);
      cacheObject[cacheKey] = recoveredValue ? recoveredValue : cacheObject[cacheKey];
    }
  }

}


interface Cache<T> {
  [key: string]: T | Array<T>;
}


export interface HttpConfigurationCache {
  // Banderas de obtención de datos
  cacheableDataRetrieval?: {
    get?: boolean;
    search?: boolean;
    query?: boolean;
    getDefault?: boolean;
  };

  // Opciones de caché
  cacheExpiration?: {
    shouldPersist?: boolean;
    persistanceDuration?: StorageExpirationConfiguration | null;
  };
}
