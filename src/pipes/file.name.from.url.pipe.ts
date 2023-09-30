import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filenameFromUrl'
})
export class FilenameFromUrlPipe implements PipeTransform {
  transform(url: string): string {
    const parts = url.split('/');
    const filenameWithExtension = parts[parts.length - 1];

    if (filenameWithExtension.includes('%20')) {
      const decodedFilename = decodeURIComponent(filenameWithExtension);
      const filenameParts = decodedFilename.split('_');
      const filteredParts = filenameParts.slice(1, -1);
      const filteredFilename = filteredParts.join('_');
      const extension = filenameParts[filenameParts.length - 1].split('.').pop();
      return filteredFilename + '.' + extension;
    } else {
      const filenameParts = filenameWithExtension.split('_');
      const filteredParts = filenameParts.slice(1, -1);
      const filteredFilename = filteredParts.join('_');
      const extension = filenameWithExtension.split('.').pop();
      return filteredFilename + '.' + extension;
    }
  }
}
