import { Pipe, PipeTransform } from '@angular/core';
import * as numeral from 'numeral';

@Pipe({
  name: 'numeralFormat'
})
export class NumeralFormatPipe implements PipeTransform {

  transform(value: number | string, inputFormat?: string): string {
    // Convierte el valor a número si es una cadena
    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    // Aplica el formato de entrada utilizando Numeral.js
    const formattedValue = inputFormat ? numeral(numValue).format(inputFormat) : numeral(numValue).format();

    return formattedValue;
  }
}
