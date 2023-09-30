import { Component, EventEmitter, Input, Output, forwardRef, Self, Inject, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

import { UtilsService } from '@basic/utils.service';

import { TUI_ARROW } from '@taiga-ui/kit';
import { TuiDay, TuiDayRange, TuiMonth } from '@taiga-ui/cdk';
import { tuiCreateDefaultDayRangePeriods } from '@taiga-ui/kit';

import moment, { Moment } from 'moment';

import { HelperPage } from '../base/helper.page';
import { UISelectOption } from '../select/select.component';

// Const
export const TUI_TODAY = new TuiDay(moment().year(), moment().month(), moment().date());
export const TUI_TODAY_RANGE = new TuiDayRange(TUI_TODAY, TUI_TODAY);


@Component({
  selector: 'dropdown-date-range',
  templateUrl: './dropdown-date-range.component.html',
  styleUrls: ['./dropdown-date-range.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownDateRangeComponent),
      multi: true
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownDateRangeComponent extends HelperPage implements ControlValueAccessor {


  // Flag Management
  open = false;
  selectedByLabel = true;

  // Date Labels
  readonly labelDates: string[] = [
    'Hoy',
    'Ayer',
    'Esta semana',
    'Semana pasada',
    'Este mes',
    'Mes pasado',
    'Este año',
    'Año anterior'
  ];

  // Labels
  labelDate: string = this.labelDates[0];
  indexLabel: number = 0;
  labelComparativeDate: string = '';

  // Input parameters
  @Input() options: Array<UISelectOption> = [];
  @Input() busy: boolean = false;


  // Output Events
  @Output() onConfirmDelete = new EventEmitter<boolean>();
  @Output() onSelect = new EventEmitter<any>();

  // Icons
  readonly arrow = TUI_ARROW;

  //Private variables
  protected showDelete = false;

  // Value Accessor
  value: UIDateRange = { rangeDate: TUI_TODAY_RANGE, comparativeRangeDate: this.tuiDayRangeComparative, calendarType: this.calendarType, label: this.labelDate };
  disabled = false;

  onChange = (_: any) => { };
  onTouched = () => { };


  // Tui
  hoveredItem: TuiDay | null = null;
  maxViewedMonth: TuiMonth = TuiMonth.currentLocal();

  constructor(
    public utilsService: UtilsService,
  ) {
    super();
  }


  writeValue(value: UIDateRange) {
    value.comparativeRangeDate = value.comparativeRangeDate || this.tuiDayRangeComparative;
    value.calendarType = value.calendarType || this.calendarType;
    if (this.value !== value) {
      this.value = value;
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  /**
   * @section UI Events Changes
   */

  onInnerComponentValueChange(value: UIDateRange) {
    if (!this.value) {
      this.writeValue({ rangeDate: TUI_TODAY_RANGE, label: this.labelDate });
    }


    this.writeValue(value);
    this.onChange(value);

    this.onTouched();
    this.open = false;
    this.onSelect.emit(this.value);
  }

  onButtonDateLabelClick(label: string, indexLabel: number) {
    this.selectedByLabel = true;
    this.indexLabel = indexLabel;
    this.value.rangeDate = this.tuiDayRange;
    this.onInnerComponentValueChange({ rangeDate: this.value.rangeDate, comparativeRangeDate: this.tuiDayRangeComparative, calendarType: this.calendarType, label: this.labelDate });
    this.labelDate = label;
    this.handleCancel();
  }

  onDayClick(day: TuiDay): void {
    this.selectedByLabel = false;

    if (this.value.rangeDate === null || !this.value.rangeDate.isSingleDay) {
      // Set before to take on the calc.
      this.value.rangeDate = new TuiDayRange(day, day);
      this.onInnerComponentValueChange({ rangeDate: this.value.rangeDate, comparativeRangeDate: this.tuiDayRangeComparative, calendarType: this.calendarType, label: this.labelDate });
    }
    else {
      // Set before to take on the calc.
      this.value.rangeDate = TuiDayRange.sort(this.value.rangeDate.from, day);
      this.onInnerComponentValueChange({ rangeDate: this.value.rangeDate, comparativeRangeDate: this.tuiDayRangeComparative, calendarType: this.calendarType, label: this.labelDate });
    }
    this.open = true;
    this.indexLabel = undefined;
    this.labelDate = this.labelForRange;
  }

  handleCancel() {
    this.open = false;
  }

  /**
   * @section Getters
   */

  get labelForRange(): string {
    const index = this.getLabelIndex();
    if (index === -1 || index === undefined) {
      const rangeDates = this.momentDateRange;
      const startMoment = rangeDates.startMoment;
      const endMoment = rangeDates.endMoment;
      const todayMoment = moment().startOf('day');
      const startOfWeekMoment = moment().startOf('isoWeek').startOf('day');
      const endOfWeekMoment = moment().endOf('isoWeek').startOf('day');
      const startOfLastWeekMoment = moment().subtract(1, 'week').startOf('isoWeek').startOf('day');
      const endOfLastWeekMoment = moment().subtract(1, 'week').endOf('isoWeek').startOf('day');
      const startOfMonthMoment = moment().startOf('month').startOf('day');
      const endOfMonthMoment = moment().endOf('month').startOf('day');
      const startOfLastMonthMoment = moment().subtract(1, 'month').startOf('month').startOf('day');
      const endOfLastMonthMoment = moment().subtract(1, 'month').endOf('month').startOf('day');
      const startOfYearMoment = moment().startOf('year').startOf('day');
      const endOfYearMoment = moment().endOf('year').startOf('day');
      const startOfLastYearMoment = moment().subtract(1, 'year').startOf('year').startOf('day');
      const endOfLastYearMoment = moment().subtract(1, 'year').endOf('year').startOf('day');

      if (startMoment.isSame(todayMoment, 'day') && endMoment.isSame(todayMoment, 'day')) {
        return this.labelDates[0]; // 'Hoy'
      } else if (startMoment.isSame(todayMoment.subtract(1, 'day'), 'day') && endMoment.isSame(todayMoment.subtract(1, 'day'), 'day')) {
        return this.labelDates[1]; // 'Ayer'
      } else if (startMoment.isSame(startOfWeekMoment, 'day') && endMoment.isSame(endOfWeekMoment, 'day')) {
        return this.labelDates[2]; // 'Esta semana'
      } else if (startMoment.isSame(startOfLastWeekMoment, 'day') && endMoment.isSame(endOfLastWeekMoment, 'day')) {
        return this.labelDates[3]; // 'Semana pasada'
      } else if (startMoment.isSame(startOfMonthMoment, 'day') && endMoment.isSame(endOfMonthMoment, 'day')) {
        return this.labelDates[4]; // 'Este mes'
      } else if (startMoment.isSame(startOfLastMonthMoment, 'day') && endMoment.isSame(endOfLastMonthMoment, 'day')) {
        return this.labelDates[5]; // 'Mes pasado'
      } else if (startMoment.isSame(startOfYearMoment, 'day') && endMoment.isSame(endOfYearMoment, 'day')) {
        return this.labelDates[6]; // 'Este año'
      } else if (startMoment.isSame(startOfLastYearMoment, 'day') && endMoment.isSame(endOfLastYearMoment, 'day')) {
        return this.labelDates[7]; // 'Año anterior'
      } else {
        return `${rangeDates.startMoment.format('D [de] MMMM')} - ${rangeDates.endMoment.format('D [de] MMMM')}`;
      }

    } else {
      return this.labelDates[index];
    }

  }


  get momentDateRange() {
    return { startMoment: moment(this.value.rangeDate.from.toLocalNativeDate()).locale('es'), endMoment: moment(this.value.rangeDate.to.toLocalNativeDate()).locale('es') };
  }

  get comparativeDateRange() {
    return { startMoment: moment(this.value.comparativeRangeDate.from.toLocalNativeDate()).locale('es'), endMoment: moment(this.value.comparativeRangeDate.to.toLocalNativeDate()).locale('es') };
  }


  get calendarType(): number {
    let indexLabel = this.getLabelIndex();
    if (indexLabel === 0 || indexLabel === 1) {
      return 1;
    } else if (indexLabel >= 2 && indexLabel <= 5) {
      return 2;
    } else if (indexLabel === 6 || indexLabel === 7) {
      return 4;
    } else {
      return 0;
    }
  }


  get tuiDayRange(): TuiDayRange {
    if (!this.value) {
      this.setDefaultValue();
    }
    const label = this.labelDate || this.labelDates[0];
    let startMoment = moment();
    let endMoment = moment();
    let indexLabel = this.getLabelIndex();

    if (indexLabel === 0) { // Hoy
      startMoment = moment();
      endMoment = moment();
    } else if (indexLabel === 1) { // Ayer
      startMoment.subtract(1, 'day');
      endMoment.subtract(1, 'day');
    } else if (indexLabel === 2) { // Esta semana
      startMoment.startOf('isoWeek');
      endMoment.endOf('isoWeek');
    } else if (indexLabel === 3) { // Semana pasada
      startMoment.subtract(1, 'week').startOf('isoWeek');
      endMoment.subtract(1, 'week').endOf('isoWeek');
    } else if (indexLabel === 4) {  // Este mes
      startMoment.startOf('month');
      endMoment = moment();
    } else if (indexLabel === 5) { // Mes pasado
      startMoment.subtract(1, 'month').startOf('month');
      endMoment.subtract(1, 'month').endOf('month');
    } else if (indexLabel === 6) { // Este año
      startMoment.startOf('year');
      endMoment = moment();
    } else if (indexLabel === 7) { // Año anterior
      startMoment.subtract(1, 'year').startOf('year');
      endMoment.subtract(1, 'year').endOf('year');
    }

    const startDate = new TuiDay(startMoment.year(), startMoment.month(), startMoment.date());
    const endDate = new TuiDay(endMoment.year(), endMoment.month(), endMoment.date());

    return new TuiDayRange(startDate, endDate);
  }

  get tuiDayRangeComparative(): TuiDayRange {
    if (!this.value) {
      this.setDefaultValue();
    }
    const label = this.labelDate || this.labelDates[0];
    let startMoment = moment();
    let endMoment = moment();
    let indexLabel = this.getLabelIndex()

    if (indexLabel === 0) { // Hoy
      startMoment.subtract(1, 'day');
      endMoment.subtract(1, 'day');
    } else if (indexLabel === 1) { // Ayer
      startMoment.subtract(2, 'day');
      endMoment.subtract(2, 'day');
    } else if (indexLabel === 2) { // Esta semana
      startMoment.subtract(1, 'week').startOf('isoWeek');
      endMoment.subtract(1, 'week').endOf('isoWeek');
    } else if (indexLabel === 3) { // Semana pasada
      startMoment.subtract(2, 'week').startOf('isoWeek');
      endMoment.subtract(2, 'week').endOf('isoWeek');
    } else if (indexLabel === 4) {  // Este mes
      startMoment.subtract(1, 'month').startOf('month');
      endMoment.subtract(1, 'month').endOf('month');
    } else if (indexLabel === 5) { // Mes pasado
      startMoment.subtract(2, 'month').startOf('month');
      endMoment.subtract(2, 'month').endOf('month');
    } else if (indexLabel === 6) { // Este año
      startMoment.subtract(1, 'year').startOf('year');
      endMoment.subtract(1, 'year').endOf('year');
    } else if (indexLabel === 7) { // Año anterior
      startMoment.subtract(2, 'year').startOf('year');
      endMoment.subtract(2, 'year').endOf('year');
    } else {
      // Calcular la diferencia en días
      const to = moment(this.value.rangeDate.to.toLocalNativeDate())
      const from = moment(this.value.rangeDate.from.toLocalNativeDate())
      const daysOfDifference = to.diff(from, 'days');
      endMoment = from.subtract(daysOfDifference > 0 ? 1 : 0, 'days');
      startMoment = moment(endMoment).subtract(daysOfDifference, 'days');
    }


    const startDate = new TuiDay(startMoment.year(), startMoment.month(), startMoment.date());
    const endDate = new TuiDay(endMoment.year(), endMoment.month(), endMoment.date());
    return new TuiDayRange(startDate, endDate);
  }


  get ComparativeLabel(): string {
    if (this.selectedByLabel) {
      const label = this.labelDate || this.labelDates[0];
      const today = moment().locale('es');
      const yesterday = moment().locale('es').subtract(1, 'day');
      const startOfWeek = moment().locale('es').startOf('isoWeek'); // Inicio de semana ajustado a lunes
      const startOfLastWeek = moment().locale('es').subtract(1, 'week').startOf('isoWeek'); // Inicio de semana ajustado a lunes

      if (label === 'Hoy') {
        return yesterday.format(' [ayer] DD [de] MMMM');
      } else if (label === 'Ayer') {
        const previousDay = yesterday.subtract(1, 'day'); // Día anterior al 'Ayer'
        return previousDay.format('dddd');
      } else if (label === 'Esta semana') {
        return startOfWeek.isSame(moment(), 'isoWeek') ? 'semana anterior' : 'semana anterior';
      } else if (label === 'Semana pasada') {
        return startOfLastWeek.isSame(moment(), 'isoWeek') ? 'semana anterior' : 'semana antepasada';
      } else if (label === 'Este mes') {
        return today.subtract(1, 'month').format('MMMM');
      } else if (label === 'Mes pasado') {
        return today.subtract(2, 'month').format('MMMM');
      } else if (label === 'Este año') {
        return today.subtract(1, 'year').format('YYYY');
      } else if (label === 'Año anterior') {
        return today.subtract(2, 'year').format('YYYY');
      }
      return 'periodo anterior'; // Etiqueta no válida
    }
    else {
      return `${moment(this.value.comparativeRangeDate.from.toLocalNativeDate()).locale('es').format('DD [de] MMMM')} al ${moment(this.value.comparativeRangeDate.to.toLocalNativeDate()).locale('es').format('DD [de] MMMM')}`;
    }
  }


  /**
   * @section Private Methods
   */

  private setDefaultValue(): void {
    if (!this.value) {
      this.value = {
        rangeDate: TUI_TODAY_RANGE,
      };
    }
  }

  private getLabelIndex(): number {
    return this.selectedByLabel === false ? -1 : this.indexLabel;
  }

}

export interface UIDateRange {
  rangeDate: TuiDayRange;
  comparativeRangeDate?: TuiDayRange;
  calendarType?: number;
  label?: string
}
