import { IEntidadeDominioDTO } from './ientidade-dominio-dto';

export interface IElementoDTO extends IEntidadeDominioDTO {

  descricao: string;
  elementoNome: string;
  elementoUrl: string;
  embed: string;
  tipoElemento: string;
  titulo: string;
  status: boolean;
}
