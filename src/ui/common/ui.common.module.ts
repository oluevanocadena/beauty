import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";

import { ActionBarComponent } from "@ui/common/action-bar/action-bar.component";
import { UIModule } from "@ui/components/ui.module";
import { NgZorroUIModule } from "@ui/ng.zorro.module";
import { TuiUIModule } from "@ui/tui.module";

import { NgxBarcode6Module } from "ngx-barcode6";

import { DirectivesModule } from "src/directives/directives.module";
import { PipesModule } from "src/pipes/pipes.module";

import { ChooseCardComponent } from "./choose-card/choose-card.component";
import { ConfirmModalComponent } from "./confirm-modal/confirm-modal.component";

const arrayComponents = [
  ActionBarComponent,
  ChooseCardComponent,
  ConfirmModalComponent,
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    TuiUIModule,
    DirectivesModule,
    NgZorroUIModule,
    NgxBarcode6Module,
    UIModule,
    PipesModule,
  ],
  declarations: arrayComponents,
  exports: arrayComponents,
})
export class UICommonComponentsModule { }
