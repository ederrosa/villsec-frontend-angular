import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { API_CONFIGURATION } from 'src/configurations/api.configuration';
import { IMusicaDTO } from 'src/app/shared/models/dtos/imusica-dto';

@Injectable({
  providedIn: 'root'
})
export class MusicaService {

  private readonly API = API_CONFIGURATION.baseUrl + '/musicas';
  theIMusicaDTO: IMusicaDTO;
  eventEmitter = new EventEmitter<IMusicaDTO>();

  constructor(public http: HttpClient) { }

  getIMusicaDTO(): IMusicaDTO {
    return this.theIMusicaDTO;
  }

  setIMusicaDTO(theIMusicaDTO: IMusicaDTO): void {
    this.theIMusicaDTO = theIMusicaDTO;
    this.eventEmitter.emit(this.theIMusicaDTO);
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/${id}`,
      {
        observe: 'events',
        responseType: 'text',
      });
  }

  find(id: number) {
    return this.http.get<IMusicaDTO>(`${this.API}/${id}`).pipe(take(1));
  }

  findPage(
    page: number = 0,
    linesPerPage: number = 12,
    orderBy: string = 'index',
    direction: string = 'ASC',
    theAlbum: number): Observable<IMusicaDTO[]> {
    return this.http.get<IMusicaDTO[]>(
      `${this.API}/?page=${page}&linesPerPage=${linesPerPage}&orderBy=${orderBy}&direction=${direction}&theAlbum=${theAlbum}`).pipe(take(1)
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
