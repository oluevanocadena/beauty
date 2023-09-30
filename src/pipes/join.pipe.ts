import { Pipe, PipeTransform } from '@angular/core';
import * as numeral from 'numeral';

@Pipe({
  name: 'stringjoin'
})
export class StringJoinPipe implements PipeTransform {

  transform(value: string | string[], character: string = ','): string {
    return (value as string[])?.join(character);
  }
}
