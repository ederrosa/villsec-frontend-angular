import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API_CONFIGURATION } from 'src/configurations/api.configuration';
import { IAlbumDTO } from 'src/app/shared/models/dtos/ialbum-dto';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  private readonly API = API_CONFIGURATION.baseUrl + '/albuns';
  private theIAlbumDTO: IAlbumDTO;
  eventEmitter = new EventEmitter<IAlbumDTO>();

  constructor(public http: HttpClient) { }

  getIAlbumDTO(): IAlbumDTO {
    return this.theIAlbumDTO;
  }

  setIAlbumDTO(theIAlbumDTO: IAlbumDTO): void {
    this.theIAlbumDTO = theIAlbumDTO;
    this.eventEmitter.emit(this.theIAlbumDTO);
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/${id}`,
      {
        observe: 'events',
        responseType: 'text',
      });
  }

  find(id: number) {
    return this.http.get<IAlbumDTO>(`${this.API}/${id}`).pipe(take(1));
  }

  findPage(
    page: number = 0,
    linesPerPage: number = 12,
    orderBy: string = 'ano',
    direction: string = 'ASC'): Observable<IAlbumDTO[]> {
    return this.http.get<IAlbumDTO[]>(
      `${this.API}/?page=${page}&linesPerPage=${linesPerPage}&orderBy=${orderBy}&direction=${direction}`).pipe(take(1)
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
