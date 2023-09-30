import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TuiFileLike, TuiFileState } from '@taiga-ui/kit';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { HelperPage } from '../base/helper.page';

import { FileTransferService, BlobTemporalFile } from '@basic/file.transfer.service';
import { UtilsService } from '@basic/utils.service';

@Component({
  selector: 'file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileComponent),
      multi: true
    }
  ]
})
export class FileComponent extends HelperPage implements ControlValueAccessor {

  busy: boolean = false;
  fileState: TuiFileState = 'normal';
  file: any;
  value: any = undefined;
  disabled = false;
  uploaded = false;
  blobTemporalFile: BlobTemporalFile;

  constructor(
    private fileTransferService: FileTransferService,
    public utilsService: UtilsService
  ) {
    super();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.value) {
        this.uploaded = true;
      }
    }, 100);
  }

  onChange = (_: any) => { };
  onTouched = () => { };

  writeValue(value: any) {
    this.value = value;
    if (value) {
      this.blobTemporalFile = this.blobTemporalFile || { TemporalFileUrl: '' };
      this.blobTemporalFile.TemporalFileUrl = value;
      this.uploaded = true;
    }
    else {
      this.uploaded = false;
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  onInnerComponentValueChange(value: any) {
    this.value = value;
    this.writeValue(value);
    this.onChange(value);
    this.onTouched();
  }

  removeFile(): void {
    this.uploaded = false;
    this.onInnerComponentValueChange(undefined);
  }

  clearRejected(): void {
    this.removeFile();
  }

  makeRequest(file: TuiFileLike) {
    this.busy = true;
    this.fileTransferService.uploadFileByChunks(file).pipe(catchError<BlobTemporalFile, Observable<BlobTemporalFile>>(error => {
      this.fileState = 'error';
      this.uploaded = false;
      throw error;
    }), finalize(() => {
      this.busy = false;
    })).subscribe((response) => {
      this.uploaded = true;
      this.fileState = 'normal';
      this.blobTemporalFile = response;
      this.onInnerComponentValueChange(response.TemporalFileUrl);
    });
  }

  onReject(value: any) {
    this.uploaded = false;
    this.fileState = 'error';
  }

}
