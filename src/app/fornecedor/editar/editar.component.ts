import { AbstractControl, FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { fromEvent, merge, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { MASKS, NgBrazilValidators } from 'ng-brazil';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DisplayMessage, GenericValidator } from '../../utils/generic-form-validation';
import { Fornecedor } from '../models/fornecedor';
import { FornecedorService } from '../services/fornecedor.service';
import { ConsultaCep, Endereco } from '../models/endereco';
import { StringUtils } from '../../utils/string-utils';
import { validationMessages } from './messages-validator'

@Component({
    selector: 'app-editar',
    templateUrl: './editar.component.html'
})
export class EditarComponent implements OnInit, AfterViewInit {
    @ViewChildren(FormControlName, {read: ElementRef }) inputElements: ElementRef[];
    textoDocumento: string  = 'CPF (Requerido)';
    fornecedorForm: FormGroup;
    displayMessage: DisplayMessage;
    fornecedor: Fornecedor;
    erros: any[] = [];
    
    mudancasNaoSalvas: boolean;
    genericValidator: GenericValidator;
    submitForm: boolean;
    masks = MASKS;
    
    errorsEndereco: any[] = [];
    enderecoForm: FormGroup;
    endereco: Endereco;
    constructor
    (
      private fb: FormBuilder,
      private router: Router,
      private toastr: ToastrService,
      private fornecedorService: FornecedorService,
      private route: ActivatedRoute,
      private modalService: NgbModal
    )
    { 
      this.genericValidator = new GenericValidator(validationMessages);
      this.fornecedor = this.route.snapshot.data['fornecedor'];
    }
    
  
    ngOnInit(): void {
      this.fornecedorForm = this.fb.group({
        nome: ['', [Validators.required]],
        documento: ['', [Validators.required, NgBrazilValidators.cpf]],
        ativo: ['', [Validators.required]],
        tipoFornecedor: ['', [Validators.required]]
      });

      this.enderecoForm = this.fb.group({
        logradouro: ['', [Validators.required]],
        numero: ['', [Validators.required]],
        complemento: [''],
        bairro: ['', [Validators.required]],
        cep: ['', [Validators.required]],
        cidade: ['', [Validators.required]],
        estado: ['', [Validators.required]]
      })
  
      this.preencherFormularios();
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
  
    editarFornecedor(){
      if(this.fornecedorForm.dirty && this.fornecedorForm.valid){
        this.fornecedor = Object.assign({}, this.fornecedor, this.fornecedorForm.value);
  
        this.fornecedor.endereco.cep = StringUtils.somenteNumeros(this.fornecedor.endereco.cep);
        this.fornecedor.documento = StringUtils.somenteNumeros(this.fornecedor.documento);
        this.submitForm = true;
        this.fornecedor.tipoFornecedor = parseInt(this.tipoFornecedorForm().value);
        this.fornecedorService.editarFornecedor(this.fornecedor)
          .subscribe(
            sucesso => { this.processarSucesso(sucesso, 'Fornecedor'), this.submitForm = false;},
            erro => { this.processarFalha(erro, this.erros), this.submitForm = false;}
          );
  
        this.mudancasNaoSalvas = false;
      }
    }
  
    processarSucesso(response: any, tipo: string, redirecionar = true){
      this.fornecedorForm.reset();
      this.erros = [];
  
      this.toastr
        .success(`${tipo} atualizado com sucesso.`, 'Atualização', { progressBar: true , closeButton: true})
        .onHidden.subscribe(() => {
          if(redirecionar){
            this.router.navigate(['/fornecedores/lista-todos']);
          }
        });
    }
  
    processarFalha(response: any, error: any[]){
      error = response.error.errors;
  
      this.toastr.error(error[0], 'Opa :(', { closeButton: true});
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
      this.enderecoForm.patchValue({
          logradouro: cepConsulta.logradouro,
          bairro: cepConsulta.bairro,
          cidade: cepConsulta.localidade,
          estado: cepConsulta.uf,
          cep: cepConsulta.cep
      })
    }

    preencherFormularios(){
      this.fornecedorForm.patchValue({
        nome: this.fornecedor.nome,
        documento: this.fornecedor.documento,
        tipoFornecedor: this.fornecedor.tipoFornecedor.toString(),
        ativo: this.fornecedor.ativo
      });

      this.enderecoForm.patchValue({
        logradouro: this.fornecedor.endereco.logradouro,
        bairro: this.fornecedor.endereco.bairro,
        cidade: this.fornecedor.endereco.cidade,
        estado: this.fornecedor.endereco.estado,
        cep: this.fornecedor.endereco.cep,
        numero: this.fornecedor.endereco.numero,
        complemento: this.fornecedor.endereco.complemento
      })
    }

    abrirModal(content: any){
      this.modalService.open(content);
    }

    editarEndereco(){
      if(this.enderecoForm.dirty && this.enderecoForm.valid){
        this.endereco = Object.assign({}, this.endereco, this.enderecoForm.value);
        this.endereco.id = this.fornecedor.endereco.id;
        this.endereco.fornecedorId = this.fornecedor.id;
        this.endereco.cep =  StringUtils.somenteNumeros(this.endereco.cep);
        
        this.submitForm = true;
        this.fornecedorService.atualizarEndereco(this.endereco)
          .subscribe(
            sucesso => {
              this.processarSucesso(sucesso, 'Endereço', false);
              this.fornecedor.endereco = this.endereco;
              this.modalService.dismissAll();
              this.submitForm = false;
              this.preencherFormularios();
          },
            falha => {
              this.processarFalha(falha, this.errorsEndereco);
              this.submitForm = false;
            });
      }
      
    }
}
