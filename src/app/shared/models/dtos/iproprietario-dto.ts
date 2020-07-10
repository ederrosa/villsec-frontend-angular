import { IEntidadeDominioDTO } from './ientidade-dominio-dto';

export interface IProprietarioDTO extends IEntidadeDominioDTO {

  senha: string;
  login: string;
  matricula: string;
  urlImgPerfil: string;
  tipoUsuario: string;
  email: string;
  logradouro: string;
  cep: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  googleMapsUrl: string;
  numeroTelefone1: string;
  tipoTelefone1: string;
  numeroTelefone2: string;
  tipoTelefone2: string;
  nome: string;
  genero: string;
  statusPessoa: boolean;
  dataNascimento: string;
  sobreMim: string;
  facebook: string;
  instagram: string;
  spotify: string;
  twitter: string;
  twitch: string;
  youtube: string;
}
