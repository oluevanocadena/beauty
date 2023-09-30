import { Component, ElementRef, EventEmitter, Inject, Input, Output, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FileTransferService, BlobTemporalFile } from '@basic/file.transfer.service';

import { TuiAlertService, TuiNotification } from '@taiga-ui/core';

import { NzMessageService } from 'ng-zorro-antd/message';

import { Observable, catchError, finalize } from 'rxjs';

import { assets } from 'src/environments/environment';

@Component({
  selector: 'avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AvatarComponent),
      multi: true
    }
  ]
})
export class AvatarComponent implements ControlValueAccessor {

  // View Children
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef<any>;

  //Input
  @Input() width: string = '96px';
  @Input() height: string = '96px';
  @Input() selected = false;
  @Input() mode: 'selection' | 'no-selection' = 'no-selection';
  @Input() defaultImageAvatarUrl: string = assets.defaultAvatar;
  @Input() shadow: boolean = true;
  @Input() readonly: boolean = false;

  //Output
  @Output() onUploadedImage = new EventEmitter<string>();
  @Output() onUploadedImageFail = new EventEmitter<any>();
  @Output() onUploadingImage = new EventEmitter<any>();

  //Uploading
  @Input() uploading: boolean = false;
  @Output() uploadingChange: EventEmitter<boolean> = new EventEmitter();

  // Flag Management
  imageExist = false;

  @Output() busyChange = new EventEmitter<boolean>();



  // Image
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
    public nzMessageService: NzMessageService
  ) { }


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

  triggerInputFile() {
    if (this.disabled === false) {
      this.inputFile.nativeElement.click();
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file && file.type.match(/image\/(jpeg|png|jpg|webp)/)) {
      this.uploading = true;
      this.onUploadingImage.emit();
      this.uploadingChange.emit(true);
      this.fileTransferService.uploadFileByChunks(file, 1024, true).pipe(catchError<BlobTemporalFile, Observable<BlobTemporalFile>>(error => {
        this.onUploadedImageFail.emit();
        throw error;
      }), finalize(() => {
        this.inputFile.nativeElement.value = '';
        this.uploading = false;
      })).subscribe((response) => {
        this.onUploadedImage.emit(response.TemporalFileUrl);
        this.writeValue(response.TemporalFileUrl);
      });
    } else {
      this.nzMessageService.info('La imagen no cumple con el formato *.jpeg, *.jpg, *.png, *.webp')
    }
  }



  /**
   * Events
   */

  handleErrorImage(event: any) {
    event.target.src = assets.defaultAvatar;
  }

  onDeleteClick() {
    this.writeValue('');
    this.imageExist = false;
  }

}
