import { IEntidadeDominioDTO } from './ientidade-dominio-dto';

export interface IVideoDTO extends IEntidadeDominioDTO {

  arquivoNome: string;
  arquivoUrl: string;
  descricao: string;  
  embed: string;
  titulo: string;
}
