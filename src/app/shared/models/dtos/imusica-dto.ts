import { IEntidadeDominioDTO } from './ientidade-dominio-dto';


export interface IMusicaDTO extends IEntidadeDominioDTO{

  nome: String;
  bpm: String;
  autor: String;
  coautor: String;
  duracao: String;
  arquivoNome: String;
  arquivoUrl: String;
  copyryght: boolean;
  idioma: String;
}
