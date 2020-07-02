import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { API_CONFIGURATION } from 'src/configurations/api.configuration';
import { IVideoDTO } from 'src/app/shared/models/dtos/ivideo-dto';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private readonly API = API_CONFIGURATION.baseUrl + '/videos';
  private theIVideoDTO: IVideoDTO;
  eventEmitter = new EventEmitter<IVideoDTO>();

  constructor(public http: HttpClient) { }

  getIVideoDTO(): IVideoDTO {
    return this.theIVideoDTO;
  }

  setIVideoDTO(theIVideoDTO: IVideoDTO): void {
    this.theIVideoDTO = theIVideoDTO;
    this.eventEmitter.emit(this.theIVideoDTO);
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/${id}`,
      {
        observe: 'events',
        responseType: 'text',
      });
  }

  find(id: number) {
    return this.http.get<IVideoDTO>(`${this.API}/${id}`).pipe(take(1));
  }

  findPage(
    page: number = 0,
    linesPerPage: number = 12,
    orderBy: string = 'titulo',
    direction: string = 'ASC',
    theGaleria: number): Observable<IVideoDTO[]> {
    return this.http.get<IVideoDTO[]>(
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
