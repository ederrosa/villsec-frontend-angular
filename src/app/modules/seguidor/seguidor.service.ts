import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIGURATION } from 'src/configurations/api.configuration';
import { ISeguidorDTO } from 'src/app/shared/models/dtos/iseguidor-dto';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeguidorService {

  private readonly API = API_CONFIGURATION.baseUrl + '/seguidores';
  private theISeguidorDTO: ISeguidorDTO;
  eventEmitter = new EventEmitter<ISeguidorDTO>();

  constructor(public http: HttpClient) { }

  getISeguidorDTO(): ISeguidorDTO {
    return this.theISeguidorDTO;
  }

  setISeguidorDTO(theISeguidorDTO: ISeguidorDTO): void {
    this.theISeguidorDTO = theISeguidorDTO;
    this.eventEmitter.emit(this.theISeguidorDTO);
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/${id}`,
      {
        observe: 'events',
        responseType: 'text',
      });
  }

  find(id: number) {
    return this.http.get<ISeguidorDTO>(`${this.API}/${id}`).pipe(take(1));
  }

  findPage(
    page: number = 0,
    linesPerPage: number = 12,
    orderBy: string = 'nome',
    direction: string = 'ASC'): Observable<ISeguidorDTO[]> {
    return this.http.get<ISeguidorDTO[]>(
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
