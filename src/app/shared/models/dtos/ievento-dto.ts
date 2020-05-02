import { IEntidadeDominioDTO } from './ientidade-dominio-dto';

export interface IEventoDTO extends IEntidadeDominioDTO{

  classificacao: String;
  duracao: String;
  data: String;
  descricao: String;
  folderName: String;
  folderUrl: String;
  nome: String;
  tipoEvento: String;
  logradouro: String;
  cep: String;
  bairro: String;
  cidade: String;
  estado: String;
  pais: String;
}
