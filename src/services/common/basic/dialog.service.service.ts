import { ComponentFactoryResolver, ComponentRef, ViewContainerRef, Injectable, Injector, TemplateRef, ApplicationRef } from '@angular/core';

import { CommonAuthenticationService } from '@common/authentication.extension.service';

import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';

import { UINotificationComponent, UINotificationStatusType } from '@ui/components/notification/notification.component';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NzNotificationService } from 'ng-zorro-antd/notification';

import { HttpUnAuthorizedException, IHttpException } from './http.service';
import { MessageAlert, MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
/**
 * CookiesService proporciona métodos para guardar información segura de usuario y token de autenticación.
 * @returns void
 */
export class DialogService<TAuthenticationService extends CommonAuthenticationService<TUser>, TUser> {

  private authenticationService: TAuthenticationService;

  constructor(
    private readonly alertService: TuiAlertService,
    private readonly messageService: MessageService,
    private readonly dialogService: TuiDialogService,
    private readonly notificationService: NzNotificationService,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly injector: Injector,
    private appRef: ApplicationRef
  ) {

  }

  public setAuthenticationService(authenticationService: TAuthenticationService) {
    this.authenticationService = authenticationService;
  }

  /**
 * Muestra un mensaje que maneja la respuesta del servidor o mensajes personalizados de una respueta Http u observables.
 * @param error - Representa el mensaje overridable a mostrar en dicha alerta de error o un objeto MessageAlert.
 */
  handleError<T>(error?: MessageAlert | string) {
    const errorHandler = (error: any | IHttpException) => {
      if (error instanceof HttpUnAuthorizedException) {
        // Cerrar la sesión aquí
        if (this.setAuthenticationService) {
          this.authenticationService.logout();
        }
      }

      const alertMessage = this.messageService.getMessage('ALERT_ACTION_ERROR');
      const errorMessage = typeof error === 'string' ? error : (error?.error ?? alertMessage.message);
      this.alertService.open(errorMessage, { label: alertMessage.title, status: TuiNotification.Error }).subscribe();
      throw error;
    };

    // Devolvemos el operador `catchError` que capturará el error en un catch block.
    return catchError<T, Observable<T>>(errorHandler);
  }

  /**
   * Muestra un mensaje de confirmación en la UI del usuario para confirmar una acción que puede ser omitible.
   * @param title - Representa el titulo de la ventana de confirmación
   * @param question - Representa la pregunta de confirmación.
   * @param dismissible - Indica que es omitible la alerta por default (false).
   * @param confirmText - Indica el texto del botón de confirmación.
   * @returns - Un observable de tipo booleano con la respuesta.
   */
  confirmHandler(title: string, question: string, dismissible: boolean = false, confirmText: string = '¡Si, confirmo!') {
    return new Observable<boolean>((observer) => {
      this.dialogService.open<boolean>(TUI_PROMPT, {
        label: title,
        size: 's',
        closeable: dismissible,
        dismissible: dismissible,
        data: {
          content: question,
          yes: confirmText,
          no: 'Cancelar'
        },
      }).subscribe((decision) => {
        observer.next(decision);
        observer.complete();
      });
    });
  }



  show(status: UINotificationStatusType, message?: MessageAlert, autoClose: boolean = true, url: string = null, urlText: string = null) {
    let alertMessage: MessageAlert = message ?? this.messageService.getMessage('ALERT_ACTION_SUCCESS');
    const templateRef = this.getNotificationTemplateRef(status, alertMessage, url, urlText);
    const templateRefCloseIcon = this.getCloseIconTemplateRef();
    this.notificationService.template(templateRef, { nzDuration: autoClose === false ? 0 : 5000, nzPauseOnHover: true, nzCloseIcon: templateRefCloseIcon });
  }


  /**
   * @section | Private Methods
  */

  private getNotificationTemplateRef(type: UINotificationStatusType, message: MessageAlert, url: string = null, urlText: string = null): TemplateRef<any> {
    const componentRef = this.createInstanceComponent();

    // Establece los inputs del componente
    componentRef.instance.type = type;
    componentRef.instance.message = message.message;
    componentRef.instance.title = message.title;
    componentRef.instance.url = url;
    componentRef.instance.urlText = urlText;

    // Llama a change detector para que los cambios en los inputs sean reconocidos
    componentRef.changeDetectorRef.detectChanges();

    // Devuelve el TemplateRef del componente
    return componentRef.instance.notificationTemplate;
  }

  private getCloseIconTemplateRef(): TemplateRef<any> {
    const componentRef = this.createInstanceComponent();
    return componentRef.instance.closeIconTemplate;
  }


  private createInstanceComponent() {
    // Crea una factoría para tu componente
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UINotificationComponent);

    // Crea una instancia del componente
    return componentFactory.create(this.injector);
  }




}
