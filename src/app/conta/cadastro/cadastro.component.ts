import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { fromEvent, merge, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { CustomValidators } from 'ngx-custom-validators';
import { ToastrService } from 'ngx-toastr';

import { Usuario } from '../models/usuario';
import { ContaService } from '../services/conta.service';
import { DisplayMessage, GenericValidator, ValidationMessages } from '../../utils/generic-form-validation';
@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html'
})
export class CadastroComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, {read: ElementRef }) inputElements: ElementRef[];
  cadastroForm: FormGroup;
  usuario: Usuario;
  validationMessages: ValidationMessages;
  displayMessage: DisplayMessage;
  genericValidator: GenericValidator;
  erros: any[] = [];
  submitForm: boolean;
  mudancasNaoSalvas: boolean;

  constructor
  (
    private fb: FormBuilder,
    private contaService: ContaService,
    private router: Router,
    private toastr: ToastrService
  )
  { 
    this.validationMessages = {
      email:{
        required: 'Informe o e-mail',
        email: 'E-mail inválido'
      },
      password: {
        required: 'Informe a senha',
        rangeLength: 'A senha deve possuir entre 6 e 15 caracteres'
      },
      confirmPassword: {
        required: 'Informe a senha novamente',
        rangeLength: 'A senha deve possuir entre 6 e 15 caracteres',
        equalTo: 'As senhas não conferem'
      }
    }

    this.genericValidator = new GenericValidator(this.validationMessages);
  }
  

  ngOnInit(): void {
    let senha = new FormControl('', [Validators.required, CustomValidators.rangeLength([6, 15])]);
    let confirmSenha = new FormControl('', [Validators.required, CustomValidators.rangeLength([6, 15]), CustomValidators.equalTo(senha)]) 

    this.cadastroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: senha,
      confirmPassword: confirmSenha
    })
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.inputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processarMensagens(this.cadastroForm);
      this.mudancasNaoSalvas = true;
    })
  }

  adicionarConta(){
    if(this.cadastroForm.dirty && this.cadastroForm.valid){
      this.usuario = Object.assign({}, this.usuario, this.cadastroForm.value);
      this.submitForm = true;
      this.contaService.registrarUsuario(this.usuario)
        .subscribe(
          sucesso => { this.processarSucesso(sucesso), this.submitForm = false;},
          erro => { this.processarFalha(erro), this.submitForm = false;}
        );

      this.mudancasNaoSalvas = false;
    }
  }

  processarSucesso(response: any){
    this.cadastroForm.reset();
    this.erros = [];

    this.contaService.localStoreUtils.salvarDadosLocaisUsuario(response);

    this.toastr
      .success('Conta registrada com sucesso.', 'Bem-vindo', { progressBar: true , closeButton: true})
      .onHidden.subscribe(() => {
        this.router.navigate(['/home']);
      });

  }

  processarFalha(response: any){
    this.erros = response.error.errors;

    this.toastr.error(this.erros[0], 'Opa :(', { closeButton: true});
  }

}
