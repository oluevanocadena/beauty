import { NgModule } from "@angular/core";

import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzNotificationModule } from "ng-zorro-antd/notification";
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

@NgModule({
  exports: [
    NzDrawerModule,
    NzDropDownModule,
    NzIconModule,
    NzMenuModule,
    NzMessageModule,
    NzModalModule,
    NzNotificationModule,
    NzRadioModule,
    NzSegmentedModule,
    NzTabsModule,
    NzCollapseModule,
  ]
})
export class NgZorroUIModule { }
