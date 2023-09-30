import { Component } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { DialogService } from '@basic/dialog.service.service';
import { HttpService } from '@basic/http.service';
import { UtilsService } from '@basic/utils.service';
import { ValidatorsService } from '@basic/validators.service';

import { TUI_DATE_FORMAT, TUI_DATE_SEPARATOR, TuiDay } from '@taiga-ui/cdk';
import { HelperPage } from '@ui/components/base/helper.page';

import moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    { provide: TUI_DATE_FORMAT, useValue: 'DMY' },
    { provide: TUI_DATE_SEPARATOR, useValue: '.' },
  ],
})
export class AppComponent extends HelperPage{

  //Flag Management
  visibleSendModal = false;

  //Index
  activeItemIndex = 0;

  //FormGroup
  formGroup = new FormGroup({
    Date: new FormControl(TuiDay.currentLocal(), this.validatorsService.Required),
    Email: new FormControl(undefined, this.validatorsService.Email),
    Phone: new FormControl(undefined, this.validatorsService.Required),
  });

  //Arrays
  items: CityData[] = [];

  constructor(
    public validatorsService: ValidatorsService,
    public utilsService: UtilsService,
    public httpService: HttpService,
    public dialogService: DialogService<any, any>
  ) {
    super();
  }

  /**
   * UI Events
   */

  onSend() {
    this.visibleSendModal = true;
  }

  onConfirmSend() {
    this.utilsService.resetForm(this.formGroup);
  }

  /**
   * Getters
   */

  get canSend(): boolean {
    return this.formGroup.valid;
  }

  getFormattedAddress(item: CityData): string {
    return `${item.Township}, ${item.Municipality}, ${item.State}, ${item.Zip}`;
  }

  /**
   * Life Cycle
   */
  ngAfterViewInit() {
    this.httpService.get('https://origamicode.com.mx/NORMALIZATIONSERVICE/api/LoadAddress/ZipCode/03020').pipe(this.dialogService.handleError()).subscribe((response: any) => {
      this.items = response.AddressList;
      console.log('response', response);

    });
  }

}

interface CityData {
  City: string;
  CityCode: string;
  LoadAddressIdentifier: number;
  LoadSourceIdentifier: null | string;
  Municipality: string;
  MunicipalityCode: string;
  OfficeZipC: string;
  State: string;
  StateCode: string;
  Township: string;
  TownshipIdentifier: string;
  TownshipType: string;
  TownshipTypeCode: string;
  TownshipZipD: string;
  Zip: string;
  ZipC: string;
  ZoneType: string;
}

