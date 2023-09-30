import { NgModule } from '@angular/core';

import { ContentRendererDirective } from './render.content.directive';
import { HideDesktopOrLargeDesktopDirective, HideLGDirective, HideLargeDesktopDirective, HideMDirective, HideMobileOrTabletDirective, HideOnMobileDirective, HideSMDirective, HideXLDirective, HideXSDirective } from './screen.sizes.directive';

var declarations = [
  ContentRendererDirective,
  HideXSDirective,
  HideSMDirective,
  HideMDirective,
  HideLGDirective,
  HideXLDirective,
  HideOnMobileDirective,
  HideMobileOrTabletDirective,
  HideDesktopOrLargeDesktopDirective,
  HideLargeDesktopDirective,
]

@NgModule({
  declarations: declarations,
  exports: declarations
})
export class DirectivesModule { }
