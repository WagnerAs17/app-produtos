import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { fromEvent, merge, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { Usuario } from '../models/usuario';
import { ContaService } from '../services/conta.service';
import { DisplayMessage, GenericValidator, ValidationMessages } from '../../utils/generic-form-validation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, AfterViewInit{

  @ViewChildren(FormControlName, {read: ElementRef }) inputElements: ElementRef[];
  loginForm: FormGroup;
  usuario: Usuario;
  validationMessages: ValidationMessages;
  displayMessage: DisplayMessage;
  genericValidator: GenericValidator;
  erros: any[] = [];
  submitForm: boolean;
  returnUrl: string;
  constructor
  (
    private fb: FormBuilder,
    private contaService: ContaService,
    private router: Router,
    private toastr: ToastrService,
    private activatedRoute : ActivatedRoute
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
      }
    }

    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];

    this.genericValidator = new GenericValidator(this.validationMessages);
  }
  

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.inputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processarMensagens(this.loginForm);
    })
  }

  login(){
    if(this.loginForm.dirty && this.loginForm.valid){
      this.usuario = Object.assign({}, this.usuario, this.loginForm.value);
      this.submitForm = true;
      this.contaService.login(this.usuario)
        .subscribe(
          sucesso => { this.processarSucesso(sucesso), this.submitForm = false;},
          erro => { this.processarFalha(erro), this.submitForm = false;}
        );
    }
  }

  processarSucesso(response: any){
    this.loginForm.reset();
    this.erros = [];

    this.contaService.localStoreUtils.salvarDadosLocaisUsuario(response);

    this.toastr
      .success('Login realizado com sucesso', 'Bem-vindo', { progressBar: true , closeButton: true, timeOut: 2000})
      .onHidden.subscribe(() => {
        this.returnUrl ? this.router.navigate([this.returnUrl]) : this.router.navigate(['/home']);
      });

  }

  processarFalha(response: any){
    this.erros = response.error.errors;

    this.toastr.error(this.erros[0], 'Opa :(', { closeButton: true});
  }

}
