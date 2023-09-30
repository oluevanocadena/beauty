import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';

import { MainUIModule } from "@ui/main.ui.module";
import { UIRummioComponentsModule } from "@ui/rummio/ui.rummio.module";

import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";

var componentsExports: Array<any> = [
  FooterComponent,
  HeaderComponent,
];

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    MainUIModule,
    UIRummioComponentsModule
  ],
  declarations: componentsExports,
  exports: componentsExports
})
export class SectionComponentsModule { }
