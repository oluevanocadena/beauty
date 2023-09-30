import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";

import { TUI_LANGUAGE, TUI_SPANISH_LANGUAGE } from '@taiga-ui/i18n';

import { NgZorroUIModule } from "@ui/ng.zorro.module";

import { NgxBarcode6Module } from "ngx-barcode6";

import { DirectivesModule } from "src/directives/directives.module";
import { PipesModule } from "src/pipes/pipes.module";

import { of } from "rxjs";

import { TuiUIModule } from "../tui.module";

import { AvatarComponent } from "./avatar/avatar.component";
import { HelperPage } from "./base/helper.page";
import { UIButtonCloseComponent } from "./button-close/button-close.component";
import { UIButtonIconSelectableComponent } from "./button-icon-selectable/button-icon-selectable.component";
import { UIButtonIncrementLabeledComponent } from "./button-increment-labeled-labeled/button-increment-labeled.component";
import { UIButtonIncrementComponent } from "./button-increment/button-increment.component";
import { UIButtonComponent } from "./button/button.component";
import { CardComponent } from "./card/card.component";
import { DropdownActionsComponent } from "./dropdown-actions/dropdown-actions.component";
import { DropdownDateRangeComponent } from "./dropdown-date-range/dropdown-date-range.component";
import { DropdownOptionGroupComponent } from "./dropdown-option-group/dropdown-option-group.component";
import { FileComponent } from "./file/file.component";
import { UIGridComponent } from "./grid/grid.component";
import { ImageDragDropComponent } from "./image-drag-drop/image-drag-drop.component";
import { UIImageComponent } from "./image/image.component";
import { UIInputSearchComponent } from "./input-search/input-search.component";
import { MenuItemComponent } from "./menu-item/menu-item.component";
import { MenuSelectableButtonComponent } from "./menu-selectable-button/menu-selectable-button.component";
import { MetricIndicatorComponent } from "./metric-indicator/metric-indicator.component";
import { UIModalTitleBarComponent } from "./modal-title-bar/modal-title-bar.component";
import { UIMultiSelectComponent } from "./multiselect/multiselect.component";
import { UINotificationComponent } from "./notification/notification.component";
import { SelectComponent } from "./select/select.component";
import { UITableNavigatorComponent } from "./table-navigator/table-navigator.component";
import { UITextareaInlineComponent } from "./text-area-inline/text-area-inline.component";
import { UITextComponent } from "./text/text.component";
import { UITitleSubTitleComponent } from "./title-subtitle/title-subtitle.component";

const components = [
  AvatarComponent,
  CardComponent,
  DropdownActionsComponent,
  DropdownDateRangeComponent,
  DropdownOptionGroupComponent,
  FileComponent,
  HelperPage,
  ImageDragDropComponent,
  UIInputSearchComponent,
  MenuItemComponent,
  MenuSelectableButtonComponent,
  MetricIndicatorComponent,
  SelectComponent,
  UIButtonCloseComponent,
  UIButtonComponent,
  UIButtonIconSelectableComponent,
  UIButtonIncrementComponent,
  UIButtonIncrementLabeledComponent,

  UIGridComponent,
  UIImageComponent,
  UIModalTitleBarComponent,
  UIMultiSelectComponent,
  UINotificationComponent,
  UITableNavigatorComponent,
  UITextareaInlineComponent,
  UITextComponent,
  UITitleSubTitleComponent,
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    PipesModule,
    TuiUIModule,
    NgxBarcode6Module,
    NgZorroUIModule,
    DirectivesModule,
  ],
  declarations: components,
  exports: components,
  providers: [
    { provide: TUI_LANGUAGE, useValue: of(TUI_SPANISH_LANGUAGE), },
    { provide: TUI_SPANISH_LANGUAGE, useFactory: () => { return TUI_SPANISH_LANGUAGE }, }
  ]
})
export class UIModule { }
