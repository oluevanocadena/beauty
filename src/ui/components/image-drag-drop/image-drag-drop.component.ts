import { Component, ElementRef, Inject, Input, Output, EventEmitter, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FileTransferService, BlobTemporalFile } from '@basic/file.transfer.service';

import { TuiAlertService, TuiNotification } from '@taiga-ui/core';

import { Observable, catchError, finalize } from 'rxjs';

import { assets } from 'src/environments/environment';

import { HelperPage } from '../base/helper.page';

@Component({
  selector: 'image-drag-drop',
  templateUrl: './image-drag-drop.component.html',
  styleUrls: ['./image-drag-drop.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageDragDropComponent),
      multi: true
    }
  ]
})
export class ImageDragDropComponent extends HelperPage implements ControlValueAccessor {

  @ViewChild('inputFile', { static: false }) inputFile: ElementRef<any>;

  @Input() size: 'small' | 'medium' | 'large' | 'extra-large' = 'small';
  @Input() defaultImageUrl: string = assets.defaultImageThumbnail;
  @Output() onDelete = new EventEmitter<string>();

  imageExist = false;
  busy = false;

  private _urlImage: string;
  public get urlImage(): string {
    return this._urlImage;
  }
  public set urlImage(v: string) {
    this._urlImage = v;
    if (this.onChange) this.onChange(this.urlImage);
  }

  constructor(
    @Inject(FileTransferService) private fileTransferService: FileTransferService,
    @Inject(TuiAlertService) private alertService: TuiAlertService,
  ) {

    super();
  }


  // Variables para el control de formulario
  onChange: (_: any) => {};
  onTouched: () => {};
  @Input() disabled: boolean = false;

  // Funciones del ControlValueAccessor
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    this.urlImage = value;
  }

  // setDisabledState?(isDisabled: boolean): void {
  //   this.disabled = isDisabled;
  // }

  onDeleteClick() {
    this.onDelete.emit(this.urlImage);
  }

  triggerInputFile() {
    if (this.disabled === false) {
      this.inputFile.nativeElement.click();
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file && file.type.match(/image\/(jpeg|png|jpg|webp)/)) {
      this.busy = true;
      this.fileTransferService.uploadFileByChunks(file, 1024, true).pipe(catchError<BlobTemporalFile, Observable<BlobTemporalFile>>(error => {
        throw error;
      }), finalize(() => {
        this.inputFile.nativeElement.value = '';
        this.busy = false;
      })).subscribe((response) => {
        this.writeValue(response.TemporalFileUrl);
      });
    } else {
      this.alertService.open('La imagen no cumple con el formato *.jpeg, *.jpg, *.png, *.webp', { label: '¡Formato Inválido!', status: TuiNotification.Error })
    }
  }

  /**
   * Events
   */

  handleErrorImage(event: any) {
    event.target.src = assets.defaultImageThumbnail;
  }


}
