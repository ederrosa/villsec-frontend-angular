import { IEntidadeDominioDTO } from './ientidade-dominio-dto';

export interface IAlbumDTO extends IEntidadeDominioDTO {

  ano: String;
  capaNome: String;
  capaUrl: String;
  codigo: String;
  descricao: String;
  genero: String;
  nome: String;
}
