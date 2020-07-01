import { IEntidadeDominioDTO } from './ientidade-dominio-dto';

export interface IGaleriaDTO extends IEntidadeDominioDTO {

  descricao: string;
  status: boolean;
  titulo: string;
}
