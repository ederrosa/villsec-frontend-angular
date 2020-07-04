import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { API_CONFIGURATION } from 'src/configurations/api.configuration';
import { IImagemDTO } from 'src/app/shared/models/dtos/iimagem-dto';

@Injectable({
  providedIn: 'root'
})
export class ImagemService {

  private readonly API = API_CONFIGURATION.baseUrl + '/imagens';
  private theIImagemDTO: IImagemDTO;
  eventEmitter = new EventEmitter<IImagemDTO>();

  constructor(public http: HttpClient) { }

  getIImagemDTO(): IImagemDTO {
    return this.theIImagemDTO;
  }

  setIImagemDTO(theIImagemDTO: IImagemDTO): void {
    this.theIImagemDTO = theIImagemDTO;
    this.eventEmitter.emit(this.theIImagemDTO);
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/${id}`,
      {
        observe: 'events',
        responseType: 'text',
      });
  }

  find(id: number) {
    return this.http.get<IImagemDTO>(`${this.API}/${id}`).pipe(take(1));
  }

  findPage(
    page: number = 0,
    linesPerPage: number = 12,
    orderBy: string = 'titulo',
    direction: string = 'ASC',
    theGaleria: number): Observable<IImagemDTO[]> {
    return this.http.get<IImagemDTO[]>(
      `${this.API}/?page=${page}&linesPerPage=${linesPerPage}&orderBy=${orderBy}&direction=${direction}&theGaleria=${theGaleria}`).pipe(take(1)
      );
  }

  insert(formData: FormData) {
    return this.http.post(
      `${this.API}`,
      formData,
      {
        observe: 'events',
        responseType: 'text',
        reportProgress: true
      }
    );
  }

  update(formData: FormData, id: number) {
    return this.http.put(
      `${this.API}/${id}`,
      formData,
      {
        observe: 'events',
        responseType: 'text',
        reportProgress: true
      }
    );
  }
}
