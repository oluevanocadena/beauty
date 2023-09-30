import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trim'
})
export class TrimPipe implements PipeTransform {
  transform(value: string): string {
    if (value) {
      let trimmedValue = value.trim();
      const firstCharacter = trimmedValue.charAt(0);
      const specialCharacters = [' ', '\t', '\n', '\r', '\f', '\v'];

      if (specialCharacters.includes(firstCharacter)) {
        trimmedValue = trimmedValue.substring(1);
      }

      return trimmedValue;
    }
    return '';
  }
}
