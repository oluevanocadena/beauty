import { Injectable } from '@angular/core';

import { StorageExpirationConfiguration, StorageService } from '@basic/storage.service';

import { Observable, of, tap } from 'rxjs';

import { HttpService } from "../basic/http.service";
import { CommonExtensionService } from './common.extension.service';

@Injectable({
  providedIn: 'root'
})
export class StoreCommonExtensionService<T> extends CommonExtensionService<T> {

  constructor(
    public override httpService: HttpService,
    public override storageService: StorageService,
    protected override configurationCache: HttpConfigurationCache = {
      cacheableDataRetrieval: { get: false, search: false, query: false, getDefault: false },
      cacheExpiration: { shouldPersist: false, persistanceDuration: null }
    },
  ) {
    super(httpService, storageService, configurationCache);
  }

  /**
  * Método que establece la url de API para este servicio
  * @param url | Es la url base a la que apuntara el servicio de plantillas.
  */
  override setApiURL(url: string) {
    this.urlApi = `${url}`;
  }

  /**
   * Recupera un objeto de caché del servidor.
   * @param GUID El GUID del objeto a recuperar.
   * @returns Un observable que emite los datos del objeto.
   */
  public override get(GUID: string, BusinessInfoGUID?: string): Observable<T> {
    const cacheKey = `${this.urlApi}_${GUID}_get`;
    const url = this.createUrl(`get/guid/${encodeURIComponent(BusinessInfoGUID)}/${encodeURIComponent(GUID)}`);

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
 * Busca una plantilla por texto de búsqueda y cantidad máxima de resultados.
 * @param searchText Texto de búsqueda.
 * @param topRows Cantidad máxima de resultados.
 * @param CollectionCollectionGUID GUID de la colección de Collectionos.
 * @returns Observable que emite un arreglo de objetos <T> generic.
 */
  public override search(searchText: string = '', topRows: number = 20, BusinessInfoGUID?: string): Observable<Array<T>> {

    const methodName = 'search';
    const params = { searchText, topRows, BusinessInfoGUID };
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
   * @CollectionCollectionGUID GUID de la colección de Collectionos.
   * @returns Observable que emite un arreglo de objetos <T> generic.
   */
  public override query(searchText: string = '', startDate?: string, endDate?: string, sortColumns?: Array<string | number | symbol>, sortType: 'ASC' | 'DESC' = 'DESC', pageNumber: number = 20, pageSize: number = 50, BusinessInfoGUID?: string): Observable<Array<T>> {

    const methodName = 'store/query';
    const params = { searchText, startDate, endDate, sortColumns: sortColumns.join(','), sortType, pageNumber, pageSize, BusinessInfoGUID };
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
