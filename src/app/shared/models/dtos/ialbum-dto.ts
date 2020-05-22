import { IEntidadeDominioDTO } from './ientidade-dominio-dto';

export interface IAlbumDTO extends IEntidadeDominioDTO {

  ano: string;
  capaNome: string;
  capaUrl: string;
  codigo: string;
  descricao: string;
  genero: string;
  nome: string;
}
