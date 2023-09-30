import { Injectable } from '@angular/core';

import { TuiFileLike } from '@taiga-ui/kit';

import { catchError, forkJoin, Observable } from 'rxjs';

import { HttpService } from './http.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FileTransferService {

  protected urlApi: string;

  constructor(
    private httpService: HttpService,
    private utilsService: UtilsService
  ) { }

  /**
  * Método que establece la url de API para este servicio
  * @param url | Es la url base a la que apuntara el servicio de plantillas.
  */
  setApiURL(url: string) {
    this.urlApi = `${url}`;
  }



  /** Descarga un archivo a partir de una URL
   * @param fileUrl URL del archivo a descargar
   * @returns Observable que emite un Blob con el contenido del archivo descargado
   */
  public downloadFile(fileUrl: string, fileName: string): Observable<Blob> {
    return this.httpService.download<Blob>(`${this.urlApi}/download/${encodeURIComponent(fileUrl)}`, fileName);
  }


  /** Sube un archivo en fragmentos
   * @param file Archivo a subir
   * @param maxSizeKBChunk Tamaño máximo de cada fragmento, en kilobytes (por defecto, 1024 KB)
   * @returns Observable que emite una cadena con la URL del archivo subido una vez completada la subida
   */
  public uploadFileByChunks(file: TuiFileLike, maxSizeKBChunk: number = 1024, publicAccessLevel: boolean = false): Observable<BlobTemporalFile> {
    return new Observable<BlobTemporalFile>((observer) => {
      this.tuiFileToBlob(file).subscribe((blob) => {
        this.createChunks(blob, maxSizeKBChunk).subscribe((chunks) => {
          const requests = chunks.map((base64Chunk, index) => {
            // El primer chunk tiene el índice 1
            const chunkData: Partial<BlobChunkFile> = {
              ChunkBase64: base64Chunk,
              Partfile: index + 1,
            };
            return this.httpService.post<string>(`${this.urlApi}/upload/chunks`, chunkData);
          });

          // Itera asíncronamente todos los trozos
          forkJoin(requests).pipe(catchError<string[], Observable<string[]>>(error => {
            observer.error(error);
            throw error;
          })).subscribe((result) => {
            this.joinChunks(result, file.name, file.type, this.utilsService.getFileExtension(file.name), publicAccessLevel).pipe(catchError<BlobTemporalFile, Observable<BlobTemporalFile>>(error => {
              observer.error(error);
              throw error;
            })).subscribe((result) => {
              observer.next(result);
              observer.complete();
            })
          });
        });
      });
    });
  }

  /** Combina los fragmentos de un archivo previamente subido
  * @param temporalUrls Arreglo de URLs temporales que apuntan a los fragmentos subidos
  * @param fileName Nombre del archivo resultante
  * @param contentType Tipo MIME del archivo resultante
  * @param extension Extensión del archivo resultante
  * @returns Observable que emite una cadena con la URL del archivo resultante una vez completada la combinación
  */
  private joinChunks(temporalUrls: string[], fileName: string, contentType: string, extension: string, publicAccessLevel: boolean): Observable<BlobTemporalFile> {
    const blobChunkJoiner: BlobChunkJoiner = {
      TemporalUrlFiles: temporalUrls,
      PublicAccessLevel: publicAccessLevel,
      ContentType: contentType,
      FileName: fileName,
      FileExtension: extension
    };
    //TODO: Cambiar por el servicio de archivos a privado
    return this.httpService.post<BlobTemporalFile>(`${this.urlApi}/join/chunks`, blobChunkJoiner, true);
  }


  /**
   * Divide un Blob en múltiples chunks y los devuelve como un array de base64 strings.
   *
   * @param blob El Blob a dividir.
   * @param maxSizeKBChunk El tamaño máximo de cada chunk en KB (por defecto 1024KB).
   * @returns Un array de base64 strings que representan los chunks.
   */
  private createChunks(blob: Blob, maxSizeKBChunk: number = 1024): Observable<string[]> {
    const chunkSize = maxSizeKBChunk * 1024;
    const fileSize = blob.size;
    const chunks: string[] = [];

    // Calculate the number of chunks needed
    const numChunks = Math.ceil(fileSize / chunkSize);
    let currentChunk = 0;

    // Loop through each chunk
    return new Observable<string[]>(observer => {
      const processChunk = () => {
        const reader = new FileReader();
        const start = currentChunk * chunkSize;
        const end = Math.min(start + chunkSize, fileSize);

        reader.readAsDataURL(blob.slice(start, end));

        reader.onloadend = () => {
          const base64data = reader.result.toString().replace('data:application/octet-stream;base64,', '');
          chunks.push(base64data);

          currentChunk++;

          if (currentChunk < numChunks) {
            processChunk();
          } else {
            observer.next(chunks);
            observer.complete();
          }
        };

        reader.onerror = error => {
          observer.error(error);
        };
      };

      processChunk();
    });
  }

  /**
   * Convierte un objeto de archivo TUI en un objeto Blob.
   * @param file El objeto de archivo TUI se convertirá.
   * @returns Un observable que emite un objeto BLOB con el contenido del archivo TUI.
   */
  private tuiFileToBlob(file: TuiFileLike): Observable<Blob> {
    const reader = new FileReader();

    return new Observable<Blob>(observer => {
      reader.onloadend = () => {
        const blob = new Blob([reader.result as ArrayBuffer], { type: file.type });
        observer.next(blob);
        observer.complete();
      };

      reader.onerror = () => {
        observer.error(reader.error);
      };

      reader.readAsArrayBuffer(file as any);
    });
  }


}
export interface BlobChunkJoiner {
  TemporalUrlFiles: string[],
  PublicAccessLevel: boolean;
  ContentType: string;
  FileName: string;
  FileExtension: string;
};

export interface BlobTemporalFile {
  TemporalFileUrl: string;
  ContentType?: string;
  FileExtension?: string;
  FileName?: string;
  FileSize?: number;
}


export interface BlobChunkFile {
  ChunkBase64: string;
  Partfile: number;
}
