import { IEntidadeDominioDTO } from './ientidade-dominio-dto';

export interface IImagemDTO extends IEntidadeDominioDTO {

  arquivoNome: string;
  arquivoUrl: string;
  descricao: string;  
  titulo: string;
}
