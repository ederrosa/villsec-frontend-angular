import { IEntidadeDominioDTO } from './ientidade-dominio-dto';

export interface IElementoDTO extends IEntidadeDominioDTO {

  nome: String;
  elementoNome: String;
  elementoUrl: String;
  tipoElemento: String;
  titulo: String;
  status: boolean;
}
