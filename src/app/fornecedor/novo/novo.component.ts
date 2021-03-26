import { AbstractControl, FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { fromEvent, merge, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { MASKS, NgBrazilValidators } from 'ng-brazil';


import { DisplayMessage, GenericValidator, ValidationMessages } from '../../utils/generic-form-validation';
import { Fornecedor } from '../models/fornecedor';
import { FornecedorService } from '../services/fornecedor.service';
import { ConsultaCep } from '../models/endereco';
import { StringUtils } from '../../utils/string-utils';
@Component({
    selector: 'app-novo',
    templateUrl: './novo.component.html'
})
export class NovoComponent implements OnInit, AfterViewInit{
    
  @ViewChildren(FormControlName, {read: ElementRef }) inputElements: ElementRef[];
  fornecedorForm: FormGroup;
  validationMessages: ValidationMessages;
  displayMessage: DisplayMessage;
  genericValidator: GenericValidator;
  erros: any[] = [];
  submitForm: boolean;
  mudancasNaoSalvas: boolean;
  fornecedor: Fornecedor;
  masks = MASKS;
  textoDocumento: string  = 'CPF (Requerido)';

  constructor
  (
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private fornecedorService: FornecedorService
  )
  { 
    this.validationMessages = {
      nome: {
        required: 'Informe o seu nome'
      },
      documento: {
        required: 'Informe o seu documento',
        cpf: 'CPF em formato inválido',
        cnpj: 'CNPJ em formato inválido',
      },
      tipoFornecedor: {
        required: 'Informe o tipo de fornecedor'
      },
      logradouro: {
        required: 'Informe o logradouro'
      },
      numero:{
        required: 'Informe o número'
      },
      bairro: {
        required: 'Informe o bairro'
      },
      cep: {
        required: 'Informe o cep'
      },
      cidade: {
        required: 'Informe a cidade'
      },
      estado: {
        required: 'Informe o estado'
      }
    }

    this.genericValidator = new GenericValidator(this.validationMessages);
  }
  

  ngOnInit(): void {
    this.fornecedorForm = this.fb.group({
      nome: ['', [Validators.required]],
      documento: ['', [Validators.required, NgBrazilValidators.cpf]],
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]],
      endereco: this.fb.group({
        logradouro: ['', [Validators.required]],
        numero: ['', [Validators.required]],
        complemento: [''],
        bairro: ['', [Validators.required]],
        cep: ['', [Validators.required]],
        cidade: ['', [Validators.required]],
        estado: ['', [Validators.required]]
      })
    });

    this.fornecedorForm.patchValue({tipoFornecedor: '1', ativo: true})
  }

  ngAfterViewInit(): void {
    this.tipoFornecedorForm().valueChanges
      .subscribe(() => {
        this.trocarDocumentoValidacao();
        this.configurarElementosValidacao();
        this.validarFormulario();
      })

    this.configurarElementosValidacao();
  }

  configurarElementosValidacao(){
    let controlBlurs: Observable<any>[] = this.inputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(() => {
      this.validarFormulario();
    })
  }

  validarFormulario(){
    this.displayMessage = this.genericValidator.processarMensagens(this.fornecedorForm);
    this.mudancasNaoSalvas = true;
  }

  trocarDocumentoValidacao(){
    if(this.tipoFornecedorForm().value === '1'){
      this.documento().clearValidators();
      this.documento().setValidators([Validators.required, NgBrazilValidators.cpf]);
      this.textoDocumento = "CPF (Requerido)";
      return;
    }

    this.documento().clearValidators();
    this.documento().setValidators([Validators.required, NgBrazilValidators.cnpj]);
    this.textoDocumento = "CNPJ (Requerido)";
  }

  tipoFornecedorForm(): AbstractControl{
    return this.fornecedorForm.get('tipoFornecedor');
  }

  documento(): AbstractControl{
    return this.fornecedorForm.get('documento');
  }

  adicionarFornecedor(){
    if(this.fornecedorForm.dirty && this.fornecedorForm.valid){
      this.fornecedor = Object.assign({}, this.fornecedor, this.fornecedorForm.value);

      this.fornecedor.endereco.cep = StringUtils.somenteNumeros(this.fornecedor.endereco.cep);
      this.fornecedor.documento = StringUtils.somenteNumeros(this.fornecedor.documento);
      this.submitForm = true;
      this.fornecedor.tipoFornecedor = parseInt(this.tipoFornecedorForm().value);
      this.fornecedorService.registrarFornecedor(this.fornecedor)
        .subscribe(
          sucesso => { this.processarSucesso(sucesso), this.submitForm = false;},
          erro => { this.processarFalha(erro), this.submitForm = false;}
        );

      this.mudancasNaoSalvas = false;
    }
  }

  processarSucesso(response: any){
    this.fornecedorForm.reset();
    this.erros = [];

    this.toastr
      .success('Fornecedor registrado com sucesso.', 'Bem-vindo', { progressBar: true , closeButton: true})
      .onHidden.subscribe(() => {
        this.router.navigate(['/fornecedores/lista-todos']);
      });
  }

  processarFalha(response: any){
    this.erros = response.error.errors;

    this.toastr.error(this.erros[0], 'Opa :(', { closeButton: true});
  }

  buscarCep(cep: string){
    cep = StringUtils.somenteNumeros(cep);
    if(cep.length < 8) return;

    this.fornecedorService.obterCep(cep)
      .subscribe(endereco => {
        this.preencherCepConsulta(endereco);
      }, error => this.erros.push(error));
  }

  preencherCepConsulta(cepConsulta: ConsultaCep){
    this.fornecedorForm.patchValue({
      endereco: {
        logradouro: cepConsulta.logradouro,
        bairro: cepConsulta.bairro,
        cidade: cepConsulta.localidade,
        estado: cepConsulta.uf,
        cep: cepConsulta.cep
      }
    })
  }
}
