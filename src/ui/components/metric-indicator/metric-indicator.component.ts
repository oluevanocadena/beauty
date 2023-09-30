import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'metric-indicator',
  templateUrl: './metric-indicator.component.html',
  styleUrls: ['./metric-indicator.component.scss']
})
export class MetricIndicatorComponent {

  @Input() value: number;
  @Input() previousValue: number;
  @Input() format: string;


  constructor(
    private sanitizer: DomSanitizer
  ) {

  }

  get percentVariation() {
    return (this.value && this.previousValue) ? (this.value - this.previousValue) / (this.previousValue || 1) : 0;
  }


}
