import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(date: string, format: string = 'YYYY-MM-DD', showElapsed: boolean = false): string {
    if (!date) {
      return '';
    }
    const momentDate = moment(date);
    if (showElapsed) {
      const elapsed = moment().diff(momentDate);
      const duration = moment.duration(elapsed);
      if (duration.asSeconds() < 60) {
        return 'menos de 1 minuto';
      } else if (duration.asMinutes() < 60) {
        const minutes = Math.floor(duration.asMinutes());
        return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
      } else if (duration.asHours() < 24) {
        const hours = Math.floor(duration.asHours());
        return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
      } else if (duration.asDays() < 30) {
        const days = Math.floor(duration.asDays());
        return `${days} ${days === 1 ? 'día' : 'días'}`;
      } else if (duration.asMonths() < 12) {
        const months = Math.floor(duration.asMonths());
        return `${months} ${months === 1 ? 'mes' : 'meses'}`;
      } else {
        const years = Math.floor(duration.asYears());
        return `${years} ${years === 1 ? 'año' : 'años'}`;
      }
    }
    return momentDate.locale('es').format(format);
  }
}
