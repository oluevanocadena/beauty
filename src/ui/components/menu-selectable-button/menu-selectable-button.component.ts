import { Component, Input, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { UtilsService } from '@basic/utils.service';

@Component({
  selector: 'menu-selectable-button',
  templateUrl: './menu-selectable-button.component.html',
  styleUrls: ['./menu-selectable-button.component.scss']
})
export class MenuSelectableButtonComponent {

  @Input() urlRedirect: string;
  @Input() icon: string;
  @Input() text: string;

  @Input() selected: boolean;
  @Input() autoSelectable: boolean = false;

  constructor(
    private utilsService: UtilsService,
    private router: Router,
  ) {

    // Suscribirse al evento NavigationEnd para actualizar la URL actual
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && this.autoSelectable) {
        this.selected = this.isButtonSelected(event.url);
      }
    });

  }

  ngOnChanges() {
    setTimeout(() => {
      if (this.autoSelectable) {
        this.selected = this.isButtonSelected(this.router.url);
      }
    }, 1);
  }


  ngAfterViewInit() {
    setTimeout(() => {
      if (this.autoSelectable) {
        this.selected = this.isButtonSelected(this.router.url);
      }
    }, 100);
  }

  isButtonSelected(currentUrl: string): boolean {
    return this.utilsService.isUrlMatched(currentUrl, this.urlRedirect);
  }

  navigate() {
    if (this.urlRedirect) {
      location.href = this.urlRedirect;
    }
  }

}
