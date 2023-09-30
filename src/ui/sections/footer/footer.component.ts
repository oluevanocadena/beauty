import { Component, Input } from '@angular/core';

import { HttpInterceptorService } from '@basic/http.interceptor.service';
import { HelperPage } from '@ui/components/base/helper.page';
import { Routes } from 'src/routes/routes';

@Component({
  selector: 'page-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent extends HelperPage {

  @Input() responsive: boolean = false;

  public openMenuDropDown: any = false;
  override routes = Routes;

  constructor(
    public httpInterceptorService: HttpInterceptorService
  ) {
    super();
  }
}
