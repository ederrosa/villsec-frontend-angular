import { IEntidadeDominioDTO } from './ientidade-dominio-dto';

export interface IEventoDTO extends IEntidadeDominioDTO{

  classificacao: string;
  descricao: string;
  diaInicio: string;
  diaTermino: string;
  horaInicio: string;
  horaTermino: string;  
  folderName: string;
  folderUrl: string;
  ingressoUrl: string;
  nome: string;
  tipoEvento: string;
  logradouro: string;
  cep: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
}
