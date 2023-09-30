import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CapitalizationPipe, CapitalizeFirstLetterPipe } from './capitalization.pipe';
import { DateFormatPipe } from './date.format.pipe';
import { FilenameFromUrlPipe } from './file.name.from.url.pipe';
import { StringJoinPipe } from './join.pipe';
import { NumeralFormatPipe } from './numeral.pipe';
import { SafeHtmlPipe } from './safe.html.pipe';
import { TrimPipe } from './trim.pipe';
// Importa otros pipes personalizados aquí

const pipes = [
  SafeHtmlPipe,
  DateFormatPipe,
  NumeralFormatPipe,
  StringJoinPipe,
  CapitalizationPipe,
  TrimPipe,
  CapitalizeFirstLetterPipe,
  FilenameFromUrlPipe,
];

@NgModule({
  declarations: pipes,
  imports: [CommonModule],
  exports: pipes,
})
export class PipesModule { }
