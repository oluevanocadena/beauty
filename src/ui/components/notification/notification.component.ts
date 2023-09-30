import { Component, Input, ViewChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'ui-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class UINotificationComponent {

  @ViewChild('notificationTemplate', { static: true }) notificationTemplate: TemplateRef<any>;
  @ViewChild('closeIconTemplate', { static: true }) closeIconTemplate: TemplateRef<any>;


  @Input() type: UINotificationStatusType = 'info';
  @Input() message: string;
  @Input() title: string;
  @Input() url: string;
  @Input() urlText: string;

  constructor(
  ) {

  }

  get getClassColor(): string {
    switch (this.type) {
      case 'success':
        return 'sk-bc-green';
      case 'error':
        return 'sk-bc-red';
      case 'warning':
        return 'sk-bc-orange';
      case 'info':
        return 'sk-bc-blue';
      default:
        return 'sk-bc-blue';
    }
  }

  get getClassGradientColor(): string {
    switch (this.type) {
      case 'success':
        return 'sk-bc-grad-green';
      case 'error':
        return 'sk-bc-grad-red';
      case 'warning':
        return 'sk-bc-grad-orange';
      case 'info':
        return 'sk-bc-grad-blue';
      default:
        return 'sk-bc-grad-blue';
    }
  }


  get getIcon(): string {
    switch (this.type) {
      case 'success':
        return 'done';
      case 'error':
        return 'close';
      case 'warning':
        return 'priority_high';
      case 'info':
        return 'info_i';
      default:
        return 'question_mark';
    }
  }

  get getClassIconColor(): string {
    switch (this.type) {
      case 'success':
        return 'sk-fc-green';
      case 'error':
        return 'sk-fc-red';
      case 'warning':
        return 'sk-fc-orange';
      case 'info':
        return 'sk-fc-blue';
      default:
        return 'sk-fc-blue';
    }
  }

}


export type UINotificationStatusType = 'success' | 'error' | 'warning' | 'info';
