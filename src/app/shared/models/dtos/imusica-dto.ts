import { IEntidadeDominioDTO } from './ientidade-dominio-dto';


export interface IMusicaDTO extends IEntidadeDominioDTO{

  nome: string;
  bpm: string;
  autor: string;
  coautor: string;
  duracao: string;
  arquivoNome: string;
  arquivoUrl: string;
  copyryght: boolean;
  idioma: string;
}
