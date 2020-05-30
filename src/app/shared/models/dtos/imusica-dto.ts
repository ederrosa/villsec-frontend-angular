import { IEntidadeDominioDTO } from './ientidade-dominio-dto';


export interface IMusicaDTO extends IEntidadeDominioDTO{

  arquivoNome: string;
  arquivoUrl: string;
  autor: string;
  bpm: string;
  coautor: string;
  copyright: boolean;
  duracao: string;
  faixa: string;
  idioma: string;
  nome: string; 
}
