
import { Observable, of, tap } from 'rxjs';
import { HttpService } from "../basic/http.service";
import { Injectable } from '@angular/core';
import { StorageExpirationConfiguration, StorageService } from '@basic/storage.service';
import { CommonExtensionService } from './common.extension.service';


@Injectable({
  providedIn: 'root'
})
export class CommonTemplateService<TTemplate> extends CommonExtensionService<TTemplate> {

  constructor(public override httpService: HttpService, public override storageService: StorageService) { super(httpService, storageService, { cacheableDataRetrieval: { get: false, query: false, search: false, getDefault: true }, cacheExpiration: { shouldPersist: false, persistanceDuration: { value: 24, timeUnit: 'hours' } } }); }

  /**
  * Método que establece la url de API para este servicio
  * @param url | Es la url base a la que apuntara el servicio de plantillas.
  */
  override setApiURL(url: string) {
    super.urlApi = `${url}`;
  }

  /**
   * Busca una plantilla por texto de búsqueda y cantidad máxima de resultados.
   * @param searchText Texto de búsqueda.
   * @param topRows Cantidad máxima de resultados.
   * @returns Observable que emite un arreglo de objetos <TTemplate> generic.
   */
  public filter(TemplateObjectClassGUID: string = ''): Observable<Array<TTemplate>> {

    const methodName = 'filter';
    const params = { TemplateObjectClassGUID };
    const cacheKey = this.createCacheKey(methodName, params);
    const url = this.createUrl(methodName, params);

    this.validateCache(this.searchCache, this.configurationCache.cacheableDataRetrieval.search, cacheKey);

    if (this.configurationCache.cacheableDataRetrieval.search === true && this.searchCache[cacheKey]) {
      return of(JSON.parse(JSON.stringify(this.searchCache[cacheKey])) as Array<TTemplate>);
    }
    else {
      return this.httpService.get<Array<TTemplate>>(url).pipe(tap((data: TTemplate[]) => {
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
  * @param TemplateTypeId Identificador del tipo de plantilla.
  * @param TemplateObjectClassId Identificador de la clase de plantilla.
  * @returns Observable que emite un arreglo de objetos <TTemplate> generic.
  */
  public override query(searchText: string = '', startDate?: string, endDate?: string, sortColumns?: Array<string | number | symbol>, sortType: 'ASC' | 'DESC' = 'DESC', pageNumber: number = 20, pageSize: number = 50, TemplateObjectClassGUID?: string): Observable<Array<TTemplate>> {

    const methodName = 'query';
    const params = { searchText, startDate, endDate, sortColumns: sortColumns.join(','), sortType, pageNumber, pageSize, TemplateObjectClassGUID };
    const cacheKey = this.createCacheKey(methodName, params);
    const url = this.createUrl(methodName, params);

    this.validateCache(this.queryCache, this.configurationCache.cacheableDataRetrieval.query, cacheKey);

    if (this.configurationCache.cacheableDataRetrieval.query === true && this.queryCache[cacheKey]) {
      return of(JSON.parse(JSON.stringify(this.queryCache[cacheKey])) as Array<TTemplate>);
    }
    else {
      return this.httpService.get<Array<TTemplate>>(url).pipe(tap(data => {
        this.queryCache[cacheKey] = data;
        if (this.configurationCache.cacheExpiration.shouldPersist && this.configurationCache.cacheableDataRetrieval.query) {
          this.storageService.set(cacheKey, data, this.configurationCache.cacheExpiration.persistanceDuration)
        }
      }));
    }
  }

  /**
  * Busca una plantilla por texto de búsqueda y cantidad máxima de resultados.
  * @param searchText Texto de búsqueda.
  * @param topRows Cantidad máxima de resultados.
  * @returns Observable que emite un arreglo de objetos <TTemplate> generic.
  */
  public sendTest(GUID: string = '', ToSendEmail: string): Observable<Array<void>> {
    return this.httpService.post<Array<void>>(`${this.urlApi}/sendtest`, { GUID, ToSendEmail });
  }

}

export interface ITemplate {
  Id?: number,
  GUID?: string;
  Description?: string;
  JsonTemplate?: string;
  HTMLTemplate?: string;
  ContentTemplate?: string;

  TemplateObjectClassGUID?: string;

  IsDeleted?: boolean;
  UpdatedAt?: string;
}

export interface EmailTemplate extends ITemplate {
  Id?: number;
  GUID: string;
  CreationDate?: string;
  Description: string;

  JsonTemplate?: string;
  HTMLTemplate?: string;

  TemplateObjectClassGUID: string;

  IsDeleted?: boolean;
  UpdatedAt?: string;
}


export interface PdfTemplate extends ITemplate {
  Id?: number;
  GUID: string;
  CreationDate?: string;
  Description: string;

  HTMLTemplate?: string;
  TemplateObjectClassGUID: string;

  IsDeleted?: boolean;
  UpdatedAt?: string;
}

export interface PushTemplate {
  Id?: number;
  GUID: string;
  CreationDate?: string;
  Description: string;

  ContentTemplate: string;
  TemplateObjectClassGUID: string;

  IsDeleted?: boolean;
  UpdatedAt?: string;
}


export enum ApplicationsGUIDEnum {
  SkyApps = '8EB6DB57-680F-4BA9-9773-C8C4D06B2001',
  Vynce = '907B463F-47EC-428F-B265-2BF63A815E7C',
  Kudu = '16C96292-9D4F-4295-A475-3304543D5533',
}
