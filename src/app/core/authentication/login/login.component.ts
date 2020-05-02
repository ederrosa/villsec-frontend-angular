import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IAutenticacaoDTO } from 'src/app/shared/models/domain/iautenticacao-dto';
import { AuthenticationService } from '../authentication.service';
import { Subscription } from 'rxjs';
import { error } from 'util';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

    theAutenticacao: IAutenticacaoDTO = {
        id: 0,
        dtCriacao: "",
        dtUltimaAlteracao: "",
        verificationCode: 0,
        login: "",
        senha: "",
        matricula: "",
        perfil: null,
        uriImgPerfil: "",
        nomeImgPerfil: "",
        tipoUsuario: 0
    };

    theInscricao: Subscription;
    email = new FormControl('', [Validators.required, Validators.email]);
    senha = new FormControl('', [Validators.required, Validators.minLength(6)]);
    hide = true;

    constructor(public theAuthenticationService: AuthenticationService) { }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.theInscricao.unsubscribe();
    }

    getErrorMessageEmail() {
        return this.email.hasError('required') ? 'Você precisa inserir um Email' :
            this.email.hasError('email') ? 'Email invalido' : '';
    }

    getErrorMessageSenha() {
        return this.senha.hasError('required') ? 'Você precisa inserir uma Senha' :
            this.senha.hasError('minLength') ? 'Tamanho minimo da senha é de 6 caracteres!' : '';
    }

    logar() {
        this.theInscricao = this.theAuthenticationService.authenticate(this.theAutenticacao)
            .subscribe(response => {
                this.theAuthenticationService.successFulLogin(
                    response.headers.get('Authorization'),
                    response.headers.get('UserType'),
                    response.headers.get('UserUriImgPerfil'),
                    response.headers.get('UserMatricula'));
            },
                error => { });
    }

    viewDidEnter() {
        this.theInscricao = this.theAuthenticationService.refreshToken()
            .subscribe(response => {
                this.theAuthenticationService.successFulLogin(
                    response.headers.get('Authorization'),
                    response.headers.get('UserType'),
                    response.headers.get('UserUriImgPerfil'),
                    response.headers.get('UserMatricula'));
            },
                error => { });

    }

    registrar() {

    }
}
