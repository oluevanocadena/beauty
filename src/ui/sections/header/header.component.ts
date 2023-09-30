import { Component, Input } from '@angular/core';
import { CookiesService } from '@basic/cookie.service';

import { HttpInterceptorService } from '@basic/http.interceptor.service';
import { AuthenticationService } from '@rummio/api/authentication.service';

import { HelperPage } from '@ui/components/base/helper.page';

import { Routes } from 'src/routes/routes';

@Component({
  selector: 'page-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends HelperPage {

  // Flag Management
  public openMenu: boolean = false;
  public openMenuDropDown: any = false;
  public isLoggedIn: boolean = false;
  public IsOwnerPropertyToo: boolean = false;

  @Input() adaptive: boolean = false;
  @Input() ownersArea: boolean = false;
  @Input() busy = false;

  override routes = Routes;

  constructor(
    public httpInterceptorService: HttpInterceptorService,
    public authenticationService: AuthenticationService
  ) {
    super();

  }

  /**
   * Api Methods
   */



  /**
   * UI Methods
   */

  toggle(): void {
    this.openMenu = !this.openMenu;
  }

  /**
   * Life Cycle Hook
   */

  ngOnInit(): void {
    this.isLoggedIn = this.authenticationService.isLoggedIn();
    this.IsOwnerPropertyToo = !!this.authenticationService.cookiesService?.UserInfo?.BusinessInfoGUID;
  }


}
