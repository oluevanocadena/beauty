import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-table-navigator',
  templateUrl: './table-navigator.component.html',
  styleUrls: ['./table-navigator.component.scss']
})
export class UITableNavigatorComponent {

  @Input() dataLength = 0;
  @Input() maxLengthToPage = 40;

  @Input() pageNumber: number = 1;
  @Output() pageNumberChange = new EventEmitter<number>();

  @Output() onPage = new EventEmitter<ITableNavigation>();

  isFirstPage = true;

  incrementPage() {
    this.pageNumber++;
    this.handlePageChange();
  }

  decrementPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.handlePageChange();
    }
  }

  handlePageChange() {
    if (this.pageNumber === 1) {
      this.isFirstPage = true;
    } else {
      this.isFirstPage = false;
    }

    this.pageNumberChange.emit(this.pageNumber);
    this.onPage.emit({ pageNumber: this.pageNumber });
  }

}

export interface ITableNavigation {
  pageNumber: number;
}
