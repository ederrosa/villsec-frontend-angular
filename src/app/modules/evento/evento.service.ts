import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIGURATION } from 'src/configurations/api.configuration';
import { IEventoDTO } from 'src/app/shared/models/dtos/ievento-dto';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  private readonly API = API_CONFIGURATION.baseUrl + '/eventos';
  theEvento: IEventoDTO;

  constructor(protected http: HttpClient) { }
  
  delete(id: number) {
    return this.http.delete(`${this.API}/${id}`,
      {
        observe: 'events',
        responseType: 'text',
      });
  }

  find(id: number) {
    return this.http.get<IEventoDTO>(`${this.API}/${id}`).pipe(take(1));
  }

  findPage(
    page: number = 0,
    linesPerPage: number = 12,
    orderBy: string = 'nome',
    direction: string = 'ASC'): Observable<IEventoDTO[]> {
    return this.http.get<IEventoDTO[]>(
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
