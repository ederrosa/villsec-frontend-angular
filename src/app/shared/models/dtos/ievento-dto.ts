import { IEntidadeDominioDTO } from './ientidade-dominio-dto';

export interface IEventoDTO extends IEntidadeDominioDTO{

  classificacao: string;
  diaInicio: string;
  diaTermino: string;
  horaInicio: string;
  horaTermino: string;
  descricao: string;
  folderName: string;
  folderUrl: string;
  nome: string;
  tipoEvento: string;
  logradouro: string;
  cep: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
}
