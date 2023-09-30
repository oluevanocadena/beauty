import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgxBarcode6Module } from 'ngx-barcode6';

import { DirectivesModule } from "src/directives/directives.module";

import { QRCodeModule } from 'angularx-qrcode';

import { PipesModule } from "../pipes/pipes.module";

import { NgZorroUIModule } from "./ng.zorro.module";
import { TuiUIModule } from "./tui.module";

import { UICommonComponentsModule } from "./common/ui.common.module";
import { UIModule } from "./components/ui.module";


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    PipesModule,
    DirectivesModule,
    TuiUIModule,
    NgxBarcode6Module,
    NgZorroUIModule,
    UICommonComponentsModule,
    UIModule,
    QRCodeModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    PipesModule,
    DirectivesModule,
    TuiUIModule,
    NgZorroUIModule,
    NgxBarcode6Module,
    UIModule,
    UICommonComponentsModule,
  ]
})
export class MainUIModule { }
