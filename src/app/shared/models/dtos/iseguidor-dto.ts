import { IEntidadeDominioDTO } from './ientidade-dominio-dto';

export interface ISeguidorDto extends IEntidadeDominioDTO{

  senha: String;
  login: String;
  matricula: String;
  urlImgPerfil: String;
  tipoUsuario: String;
  email: String;
  logradouro: String;
  cep: String;
  bairro: String;
  cidade: String;
  estado: String;
  pais: String;
  numeroTelefone1: String;
  tipoTelefone1: String;
  numeroTelefone2: String;
  tipoTelefone2: String;
  nome: String;
  genero: String;
  statusPessoa: boolean;
  dataNascimento: String;
}
