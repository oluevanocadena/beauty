import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalization'
})
export class CapitalizationPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const wordsToExclude = [
      'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to',
      'from', 'by', 'of', 'in', 'out', 'with', 'about', 'among', 'into', 'through',
      'under', 'over', 'above', 'below', 'via', 'versus', 'per', 'como', 'de', 'en',
      'con', 'por', 'para', 'sin', 'hacia', 'entre', 'durante', 'mediante', 'tras', 'según',
      'ante', 'bajo', 'sobre', 'aunque', 'porque', 'si', 'no', 'sí', 'tal', 'cual', 'cuanto',
      'mucho', 'poco', 'muy', 'tan', 'tanto', 'todo', 'nada', 'alguno', 'ninguno', 'cada', 'varios',
      'y', 'de'
      // Agrega más palabras aquí si es necesario
    ];

    const words = value.split(' ');

    const transformedWords = words.map((word: string, index: number) => {
      if (index === 0) {
        return this.capitalizeWord(word);
      } else if (!wordsToExclude.includes(word.toLowerCase())) {
        return this.capitalizeWord(word);
      } else {
        return word.toLowerCase();
      }
    });

    return transformedWords.join(' ');
  }

  private capitalizeWord(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
}


@Pipe({
  name: 'capitalizeFirstLetter'
})
export class CapitalizeFirstLetterPipe implements PipeTransform {
  transform(value: string): string {

    if (value == null || value == undefined || value == '') return value || '';
    else {
      const words = value.toLowerCase().split(' ');
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      return words.join(' ');
    }
  }
}
