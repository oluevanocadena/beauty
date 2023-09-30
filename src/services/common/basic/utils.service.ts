import { FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { Injectable } from '@angular/core';

import { TuiTimeLike, TuiTime } from '@taiga-ui/cdk';

import { getType } from "tst-reflect";

import * as moment from "moment";

import * as numeral from "numeral";

import { Observable, Observer } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() {

  }

  shareCurrentLocationUrl() {
    if (navigator.share) {
      navigator.share({
        title: 'Rummio',
        text: 'Checa esta propiedad en Rummio',
        url: window.location.href,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      console.log('Web Share not supported on this browser');
    }
  }

  timeElapsed(dateString: string, format?: string): string {
    const fecha = moment(dateString, format);
    const ahora = moment();

    const years = ahora.diff(fecha, 'years');
    fecha.add(years, 'years');

    const months = ahora.diff(fecha, 'months');
    fecha.add(months, 'months');

    const days = ahora.diff(fecha, 'days');

    let texto = 'Hace ';

    if (years > 0) {
      texto += `${years} año${years > 1 ? 's' : ''}`;
      if (months > 0) {
        texto += ` y ${months} mes${months > 1 ? 'es' : ''}`;
      }
    } else if (months > 0) {
      texto += `${months} mes${months > 1 ? 'es' : ''}`;
      if (days > 0) {
        texto += ` y ${days} día${days > 1 ? 's' : ''}`;
      }
    } else if (days > 0) {
      texto += `${days} día${days > 1 ? 's' : ''}`;
    } else {
      texto += 'hoy';
    }

    return texto;
  }

  /**
   * Recorta el nombre del archivo y decodifica la cadena de consulta (query string) de una URL.
   * @param url La URL que contiene el nombre del archivo y la cadena de consulta.
   * @returns El nombre del archivo decodificado sin la cadena de "TemporalFile_".
   */
  decodeFileNameFromUrl(url: string): string {
    const fileNameStartIndex = url.lastIndexOf('/') + 1;
    const fileName = url.substring(fileNameStartIndex);
    const fileNameWithoutPrefixAndGuid = fileName.replace('TemporalFile_', '').replace(/_[A-Fa-f0-9]{8}(-[A-Fa-f0-9]{4}){3}-[A-Fa-f0-9]{12}\./, '.');
    const decodedFileName = decodeURIComponent(fileNameWithoutPrefixAndGuid);

    return decodedFileName;
  }

  /**
   * Cambia un texto con conjunciones a un formato de nombre propio
   * @param text
   * @returns un texto en formato de nombre propio
   */
  toProperCase(text: string) {
    var words = text ? text.split(' ') : [];
    words.forEach((word, index) => {
      var conjunctions = ['de', 'del', 'al', 'a', 'e', 'y', 'con', 'en', 'las', 'los', 'el', 'lo', 'la', 'más'];
      if (conjunctions.some(x => x === word?.trim().toLowerCase())) {
        words[index] = word.toLowerCase()
      }
      else {
        words[index] = word.charAt(0).toUpperCase() + word.toLowerCase().slice(1);
      }
    });
    return words.join(' ');
  }

  /**
 * Método que codifica un valor en base64.
 *
 * @param value - El valor a codificar (puede ser texto o la representación en base64 de un objeto).
 * @returns La cadena codificada en base64.
 */
  toBase64(value: string | object): string {
    if (typeof value === 'string') {
      return btoa(value);
    } else {
      const jsonString = JSON.stringify(value);
      return btoa(jsonString);
    }
  }


  /**
   * Método que decodifica un valor en base64.
   *
   * @param base64Value - La cadena codificada en base64.
   * @returns La cadena original.
   */
  fromBase64(base64Value: string): string {
    return atob(base64Value);
  }

  /**
   * Convierte un texto en un booleano.
   * @param texto El texto a convertir.
   * @param isBase64 Indica si el texto está codificado en base64.
   * @returns El valor booleano resultante.
   */
  parseBoolean(texto: string, isBase64: boolean = false): boolean {
    let resultado: boolean;
    if (isBase64) {
      const decodedText = atob(texto);
      resultado = Boolean(JSON.parse(decodedText));
    } else {
      resultado = Boolean(JSON.parse(texto));
    }
    return resultado;
  }

  /**
   * Método de limpieza de espacios en una cadena de texto.
   * @param text
   * @returns una cadena de texto sin ningún espacio intermedio, inicial o final
   */
  clearSpaces(text: string) {
    return text.replace(/ /g, '');
  }

  /**
   * Obtiene el nombre de un archivo de una cadena de texto.
   * @param fileName
   * @returns el nombre de un archivo donde la cadena de texto es una ruta de un archivo en disco
   */
  getFileExtension(fileName: string) {
    return ((/[.]/.exec(fileName)) ? '.' + /[^.]+$/.exec(fileName)[0] : undefined);
  }

  /**
   * Obtiene el nombre de archivo de una URL de archivo.
   * @param {string} url - La URL del archivo.
   * @returns {string|null} El nombre de archivo o null si no se puede extraer.
   */
  getFileNameFromUrl(url: string): string | null {
    const pathname = new URL(url).pathname;
    const startIndex = pathname.lastIndexOf('/') + 1;
    const filename = pathname.substring(startIndex);
    return filename || null;
  }


  /**
   * Normaliza una cadena de texto con caracteres especiales.
   * @param text
   * @returns una cadena de texto normalizada sin caracteres especiales
   */
  normalizeText(text: string) {
    return text?.normalize('NFKD').replace(/[^\w]/g, '')
  }

  /**
   * Extrae de una cadena de hora la hora en entero
   * @param dateText cadena de texto en formato ('HH:mm A')
   * @returns un entero con la hora de la cadena de texto
   */
  getHourFromDateText(dateText: string, format: string = 'HH:mm A') {
    return moment(dateText as any, format).get('hour');
  }

  /**
   * Convierte una cadena de texto de servidor en una de formato de fecha y hora.
   * @param textDate valor de fecha en formato de texto.
   * @param format formato de fecha de salida de fecha y hora por default ('LTT')
   * @returns una cadena de fecha y hora
   */
  toStringDateTime(textDate: string, format: string = 'LT') {
    return moment(textDate).format(format);
  }

  /**
   * Convierte un valor de texto a formato de moneda
   * @param text numero en formato texto o numerico
   * @param format formato de moneda default ($0,0.00)
   * @returns un cadena de texto en formato moneda
   */
  toPriceString(text: string | number, format = "$0,0.00") {
    return text ? numeral(text.toString()).format(format) : '-';
  }

  /**
   * Funcion de conversion decimal a entero
   * @param decimalNumber valor decimal para truncar.
   * @returns un valor entero de un numero decimal
   */
  toInteger(decimalNumber: number) {
    return Math.trunc(decimalNumber);
  }

  /**
   * Funcion de redondeo de números.
   * @param num numero decimal a redondeadr.
   * @param places numero de posiciones de redondeo.
   * @returns un número redondeado en las posiciones indicadas.
   */
  toRound(num: number, places = 0) {
    if (typeof places === 'undefined' || +places === 0)
      return Math.round(num);

    num = +num;
    places = +places;

    if (isNaN(num) || !(typeof places === 'number' && places % 1 === 0))
      return NaN;

    // Shift
    let numText = num.toString().split('e');
    num = Math.round(+(numText[0] + 'e' + (numText[1] ? (+numText[1] + places) : places)));

    // Shift back
    numText = num.toString().split('e');
    return +(numText[0] + 'e' + (numText[1] ? (+numText[1] - places) : -places));
  }

  /**
   * Copia un texto al portapapeles
   * @param text | Texto a copiar al portapapeles
   */
  copyToClipboard(text: string): Observable<string> {
    return new Observable((observer: Observer<string>) => {
      navigator.clipboard.writeText(text)
        .then(() => {
          observer.next(text);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }


  removeProperties<T>(model: T | any, byRef: boolean = false, ...fields: string[]) {
    let modelCopy = byRef ? model : JSON.parse(JSON.stringify(model));
    fields.forEach(key => {
      delete modelCopy[key];
    });
    return modelCopy;
  }

  /**
   * Devuelve un objeto copia o por referencia con los valores de los campos definidos patchObject.
   * @template T - Tipo genérico para el modelo.
   * @param model - Es el objeto que se desea alterar sus propiedades con patchObject
   * @param patchObject - Es el objeto contenedor de cambios
   * @returns un objeto del tipo generico indicado.
   */
  patchPropertyValues<T>(model: T | any, patchObject: any, byRef: boolean = false, skipControls?: string[]) {
    let modelCopy = byRef ? model : this.cloneObject(model);;
    Object.keys(patchObject).forEach(key => {
      if ((!skipControls || !skipControls.includes(key))) {
        modelCopy[key] = patchObject[key];
      }
    });
    return modelCopy;
  }


  /**
   * Pobla un formGroup con los valores de un modelo de tipo any.
   * @param formGroup - Es el objeto contenedor de cambios
   * @param model - Es el objeto que se desea alterar sus propiedades con patchObject
   * @param skipControls - Los campos que deseas omitir en la validación.
   * @returns un objeto del tipo generico indicado.
   */
  patchFormGroupControlValues(formGroup: FormGroup, model: any, skipControls?: string[]): void {
    Object.keys(formGroup.controls).forEach((key: string) => {
      if (model.hasOwnProperty(key) && (!skipControls || !skipControls.includes(key))) {
        formGroup.controls[key].patchValue(model[key]);
      }
    });
  }

  /**
   * Modifica el valor de una propiedad en un objeto mediante el nombre de la propiedad en cadena de texto.
   * @param model - Es el modelo objetivo a modificar
   * @param keyField - Es el nombre de la propiedad a modificar en el modelo
   * @param value - Es el valor que se desea reemplazar.
   */
  replaceValue(model: any, keyField: string, value: any) {
    if (model.hasOwnProperty(keyField)) {
      model[keyField] = value;
    }
  }

  /**
   * Devuelve un objeto clonado mediante JSON.stringify() y JSON.parse()
   * @param model - Es el objeto que se desea clonar con JSON.stringify()
   * @returns un objeto clonado del tipo generico indicado.
   */
  cloneObject<T>(model: T, skipProperties?: string[]): T {
    let clone = JSON.parse(JSON.stringify(model));
    if (skipProperties) {
      skipProperties.forEach((key: string) => {
        delete clone[key];
      });
    }
    return clone;
  }

  /**
   * Compara los valores de los controles de un FormGroup con los valores de un modelo.
   * @template T - Tipo genérico para el modelo.
   * @param form - Objeto FormGroup que contiene los controles del formulario.
   * @param model - Modelo genérico T que se utilizará para comparar los valores de los controles.
   * @returns Verdadero (true) si existe al menos una diferencia, falso (false) si no existe ninguna diferencia.
   */
  hasDiffFormGroupVsModel<T>(form: FormGroup, model: T | any) {
    let result = false;
    if (form && form.controls && model) {
      Object.keys(form.controls).forEach(key => {
        const formControl = form.controls[key];
        const modelValue = model[key];

        if (formControl instanceof FormGroup) {
          if (this.hasDiffFormGroupVsModel(formControl, modelValue)) {
            result = true;
          }
        } else if (formControl instanceof FormControl) {
          if (formControl.value !== modelValue) {
            result = true;
          }
        }
      });
    }
    else {
      result = false;
    }
    return result;
  }

  /**
   * Realiza una comparación entre dos objetos.
   * @param obj1 | Objeto 1 a comparar
   * @param obj2 | Objeto 2 a comparar
   * @returns | Verdadero (true) si existe al menos una diferencia, falso (false) si no existe ninguna diferencia.
   */
  areObjectsDifferent(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) {
      return false; // Los objetos son iguales o ambos son null/undefined
    }

    if (!obj1 || !obj2) {
      return true; // Uno de los objetos es null/undefined
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return true; // Los objetos tienen un número diferente de claves
    }

    let haveDifferences = false;

    for (const key of keys1) {
      const value1 = obj1[key];
      const value2 = obj2[key];

      if (typeof value1 === 'object' && typeof value2 === 'object') {
        haveDifferences = this.areObjectsDifferent(value1, value2); // Llamada recursiva para comparar objetos anidados
      } else if (value1 !== value2) {
        haveDifferences = true;
      }

      if (haveDifferences) {
        break; // Se encontró una diferencia, no es necesario seguir comparando
      }
    }

    return haveDifferences;
  }


  /**
   * Reinicia el estado de un FormControl de un FormGroup a sus valores originales.
   * @param form | FormGroup - El FormGroup que se va a reiniciar.
   * @param controlName | string - Nombre del control a reiniciar.
   * @param clearValidators | boolean - Indica si se deben limpiar los validadores del control.
   */
  clearFormControlValidators(form: FormGroup, controlName: string) {
    form.controls[controlName].clearValidators();
    form.controls[controlName].clearAsyncValidators();
    this.markAsPristine(form, controlName);
    form.updateValueAndValidity();
  }

  /**
 * Reinicia el estado de un FormControl de un FormGroup a sus valores originales.
 * @param form | FormGroup - El FormGroup que se va a reiniciar.
 * @param controlName | string - Nombre del control a reiniciar.
 * @param clearValidators | boolean - Indica si se deben limpiar los validadores del control.
 */
  clearFormControlValue(form: FormGroup, controlName: string) {
    form.controls[controlName].patchValue(undefined);
    this.markAsPristine(form, controlName);
    form.updateValueAndValidity();
  }


  /**
   * Reinicia el estado de un FormGroup a sus valores originales.
   *
   * @param form - El FormGroup que se va a reiniciar.
   * @returns void
   */
  resetForm(form: FormGroup, clearValidators: boolean = false) {
    Object.keys(form.controls).forEach(key => {
      this.resetFormControl(form, key, clearValidators);
    });
    form.markAsPristine();
    form.markAsUntouched();
    form.reset();
  }

  /**
   * Reinicia el estado de un FormControl de un FormGroup a sus valores originales.
   *
   * @param form - El FormGroup que se va a reiniciar.
   * @returns void
   */
  resetFormControl(form: FormGroup, controlName: string, clearValidators: boolean = false) {
    if (clearValidators === true) {
      form.controls[controlName].clearValidators();
      form.controls[controlName].clearAsyncValidators();
    }
    form.controls[controlName].patchValue(undefined);
    form.controls[controlName].reset();
    this.markAsPristine(form, controlName);
    form.controls[controlName].updateValueAndValidity();
  }

  /**
   * Marca un FormControl como Pristine y Untouched.
   * @param form | FormGroup - El FormGroup que se va a reiniciar.
   * @param controlName | string - Nombre del control a reiniciar.
   */
  markAsPristine(form: FormGroup, controlName: string,) {
    form.controls[controlName].markAsPristine();
    form.controls[controlName].markAsUntouched();
    form.controls[controlName].updateValueAndValidity();
  }


  /**
   * Generates a random GUID using the version 4 UUID algorithm.
   * @returns {string} A string representing the generated GUID.
   */
  newGuid(): string {
    const hexDigits = "0123456789abcdef";
    let s = "";
    for (let i = 0; i < 36; i++) {
      if (i === 8 || i === 13 || i === 18 || i === 23) {
        s += "-";
      } else if (i === 14) {
        s += "4";
      } else if (i === 19) {
        s += hexDigits.substr((Math.random() * 4) | 0 + 8, 1);
      } else {
        s += hexDigits.substr(Math.random() * 16, 1);
      }
    }
    return s?.toUpperCase();
  }

  /**
   * Valida las propiedades de un objeto según el tipo especificado en una interfaz genérica.
   * @param obj El objeto a validar.
   * @returns El objeto validado con los valores actualizados según las reglas de validación.
   */
  sanitizeObject<T>(obj: T): void {
    const type = getType(obj);
    const properties = type.getProperties();
    properties.forEach((key: any) => {
      if (obj.hasOwnProperty(key.name)) {
        const fieldValue = obj[key.name as keyof T];

        if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
          delete obj[key.name as keyof T];
        }
      }
    });

  }

  /**
   * Convierte un texto en formato HH:mm en un objeto con las propiedades "hours" y "minutes".
   * @param time El texto que representa la hora en formato HH:mm.
   * @returns El objeto con las propiedades "hours" y "minutes".
   */
  timeToTuiTime(time: string): TuiTimeLike {
    const parsedTime = moment(time, 'HH:mm');
    const hours = parsedTime.hours();
    const minutes = parsedTime.minutes();
    const result: TuiTimeLike = { hours, minutes, seconds: 0 };
    return new TuiTime(result.hours, result.minutes);
  }

  /**
   * Ordena un array de objetos JSON por un campo específico en orden ascendente o descendente.
   * @param data El array de objetos JSON a ordenar.
   * @param field El campo por el cual se desea hacer el ordenamiento.
   * @param order El orden en el que se desea ordenar ('ASC' para ascendente, 'DESC' para descendente).
   * @returns El array ordenado.
   */
  sortArrayByField(data: any[], field: string, order: 'ASC' | 'DESC') {
    return data.sort((a, b) => {
      if (order === 'ASC') {
        if (a[field] < b[field]) return -1;
        if (a[field] > b[field]) return 1;
        return 0;
      } else if (order === 'DESC') {
        if (a[field] > b[field]) return -1;
        if (a[field] < b[field]) return 1;
        return 0;
      }

      // Si no se cumple ninguna de las condiciones anteriores, se retorna 0 por defecto
      return 0;
    });
  }

  /**
   * Suma los valores de una propiedad específica en un array de objetos.
   * @param array El array de objetos.
   * @param propertyName El nombre de la propiedad a sumar.
   * @returns La suma de los valores de la propiedad especificada.
   */
  sumByField(array: any[], propertyName: string): number {
    return array.reduce((sum, item) => sum + (item[propertyName] || 0), 0);
  }


  /**
 * Comprueba si la URL actual coincide con la URL objetivo, ignorando la cadena de consulta.
 * @param currentUrl La URL actual.
 * @param targetUrl La URL objetivo a comparar.
 * @returns `true` si la URL actual coincide con la URL objetivo, de lo contrario, `false`.
 */
  isUrlMatched(currentUrl: string, targetUrl: string): boolean {
    const currentUrlWithoutQuery = this.removeBase64Param(currentUrl.split('?')[0]);
    const targetUrlWithoutQuery = this.removeBase64Param(targetUrl.split('?')[0]);

    return currentUrlWithoutQuery === targetUrlWithoutQuery;
  }

  /**
   * Remueve la cadena de consulta base64 de una URL.
   * @param url | La URL a comprobar.
   * @returns | `true` si la URL contiene una cadena de consulta base64, de lo contrario, `false`.
   */
  removeBase64Param(url: string): string {
    const lastSlashIndex = url.lastIndexOf('/');
    const possibleBase64Param = url.substring(lastSlashIndex + 1);

    if (this.isBase64(possibleBase64Param)) {
      // If the last part of the URL is a base64 string, remove it
      return url.substring(0, lastSlashIndex);
    } else {
      // Otherwise, return the URL unchanged
      return url;
    }
  }

  /**
   * Establece la cadena de consulta base64 de una URL.
   * @param str | La cadena a comprobar.
   * @returns | `true` si la cadena parece ser base64, de lo contrario, `false`.
   */
  isBase64(str: string): boolean {
    const base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
    return base64Regex.test(str);
  }

  /**
   * Obtiene la URL actual del componente Angular.
   * @returns La URL actual del componente Angular.
   */
  getCurrentUrl(): string {
    return window.location.pathname;
  }

  /**
  * Crea una URL para llamar al método especificado, opcionalmente con los parámetros indicados.
  * @param methodName El nombre del método.
  * @param params Los parámetros para incluir en la URL.
  * @returns La URL creada.
  */
  public createUrl(url: string, params?: any) {

    // Generate the query string
    const queryString = params ? this.createQueryString(params) : '';

    //Join the url and querystring parameters
    const urlMade = `${url}?${queryString}`;

    // Return the created url
    return urlMade;
  }


  /**
  * Genera una cadena de consulta (query string) a partir de los parámetros especificados.
  * @param params Los parámetros para construir la cadena de consulta.
  * @param encodeBase64 Indica si se debe codificar en base64 los valores de los parámetros.
  * @returns La cadena de consulta generada.
  */
  public createQueryString(params: Record<string, any>, encodeBase64: boolean = false): string {

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
    return encodeBase64 ? this.toBase64(queryStringParams.join('&')) : queryStringParams.join('&');
  }

  /**
   * Decodifica una cadena en base6 de parámetros querystring.
   * @param encodedParams | La cadena de consulta codificada en base64.
   * @returns | Los parámetros de la cadena de consulta decodificados.
   */
  public decodeQueryStringParams(encodedParams: string): any {
    if (encodedParams) {
      const decodedParams = this.fromBase64(encodedParams);
      const paramsObject: any = {};
      const paramsArray = decodedParams.split('&');

      paramsArray.forEach(param => {
        const [key, value] = param.split('=');
        paramsObject[key] = value;
      });

      return paramsObject;
    }

    return null;
  }

  /**
   * Obtiene la cadena de consulta de una URL.
   * @param url | La URL a comprobar.
   * @returns | `true` si la URL contiene una cadena de consulta base64, de lo contrario, `false`.
   */
  public getQueryStringFromURL(url: string = window.location.href): string | null {
    const queryIndex = url.indexOf('?');

    if (queryIndex !== -1) {
      const queryString = url.slice(queryIndex + 1); // Extraer la cadena de consulta
      const decodedString = decodeURIComponent(queryString); // Decodificar la cadena

      return decodedString;
    }

    return null;
  }


  public parseBooleanFromNumber(value: number | string): boolean | undefined {
    var result = false;
    if (value === 0 || value === '0') {
      result = false;
    } else if (value === 1 || value === '1') {
      result = true;
    } else {
      result = null;
    }
    return result;
  }

}



