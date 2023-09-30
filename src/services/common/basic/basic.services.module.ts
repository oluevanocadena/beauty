import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, } from '@angular/common/http';
import { ApplicationRef, ComponentFactoryResolver, Injector, NgModule } from "@angular/core";
import { Router } from '@angular/router';

import { UserInfo } from '@common/authentication.extension.service';

import { TuiAlertService, TuiDialogService } from '@taiga-ui/core';

import { UIModule } from '@ui/components/ui.module';

import { NzNotificationService } from 'ng-zorro-antd/notification';

import { CookiesService } from './cookie.service';
import { DialogService } from './dialog.service.service';
import { FileTransferService } from './file.transfer.service';
import { HttpInterceptorService } from './http.interceptor.service';
import { HttpService } from "./http.service";
import { LoggerService } from './logger.service';
import { MessageService } from './message.service';
import { RouterService } from './routes.service';
import { StorageService } from './storage.service';
import { UtilsService } from './utils.service';
import { ValidatorsService } from './validators.service';
import { GoogleMapsService } from './google.maps.service';


export function httpServiceFactory(http: HttpClient, loggerService: LoggerService, cookiesService: CookiesService<UserInfo>, routesService: RouterService) {
  const service = new HttpService(http, loggerService, cookiesService, routesService);
  return service;
}

export function dialogServiceFactory(alertService: TuiAlertService, messageService: MessageService, tuiDialogService: TuiDialogService, notificationService: NzNotificationService, componentFactoryResolver: ComponentFactoryResolver, injector: Injector, applicationRef: ApplicationRef) {
  const service = new DialogService(alertService, messageService, tuiDialogService, notificationService, componentFactoryResolver, injector, applicationRef);
  return service;
}

export function cookiesServiceFactory(storageService: StorageService, loggerService: LoggerService) {
  const service = new CookiesService(storageService, loggerService);
  return service;
}

export function routesServiceFactory(router: Router) {
  const service = new RouterService(router);
  return service;
}

export function fileTransferServiceFactory(httpService: HttpService, utilsService: UtilsService) {
  return new FileTransferService(httpService, utilsService);
}


@NgModule({
  imports: [
    HttpClientModule,
    UIModule,
  ],
  providers: [
    LoggerService,
    StorageService,
    MessageService,
    ValidatorsService,
    UtilsService,
    { provide: CookiesService, useFactory: cookiesServiceFactory, deps: [StorageService, LoggerService] },
    { provide: DialogService, useFactory: dialogServiceFactory, deps: [TuiAlertService, MessageService, TuiDialogService, NzNotificationService, ComponentFactoryResolver, Injector, ApplicationRef] },
    { provide: HttpService, useFactory: httpServiceFactory, deps: [HttpClient, LoggerService, CookiesService, RouterService] },
    { provide: RouterService, useFactory: routesServiceFactory, deps: [Router] },
    { provide: FileTransferService, useFactory: fileTransferServiceFactory, deps: [HttpService, UtilsService] },
    { provide: GoogleMapsService, useClass: GoogleMapsService, },
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
  ]
})
export class BasicServicesModule { }
