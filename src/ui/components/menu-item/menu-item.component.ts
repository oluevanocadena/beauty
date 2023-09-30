import { Component, Input } from '@angular/core';

import { CookiesService } from '@basic/cookie.service';
import { RouterService } from '@basic/routes.service';

import { HelperPage } from '@ui/components/base/helper.page';

@Component({
  selector: 'menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent extends HelperPage {

  @Input() urlRedirect: string;
  @Input() icon: string;
  @Input() text: string;
  @Input() submenu = false;

  constructor(
    public routerService: RouterService
  ) {
    super();
  }


  navigate() {
    this.routerService.navigate(this.urlRedirect);
  }

}
