import { IEntidadeDominioDTO } from '../dtos/ientidade-dominio-dto';

export interface IAutenticacaoDTO extends IEntidadeDominioDTO {

    login: string;
    matricula: string;
    senha: string;
    perfil?: number[];
    uriImgPerfil?: string;
    nomeImgPerfil?: string;
    tipoUsuario: number;
}
