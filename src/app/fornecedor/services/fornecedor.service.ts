import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Fornecedor } from '../models/fornecedor';
import { BaseService } from '../../utils/service/base.service';
import { ConsultaCep, Endereco } from '../models/endereco';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable()
export class FornecedorService extends BaseService{

    constructor(private http: HttpClient){ super(); }

    obterTodos() : Observable<Fornecedor[]>{
        return this.http
            .get<Fornecedor[]>(this.urlServiceV1 + "fornecedores")
            .pipe(catchError(this.serviceError));
    }

    obterPorId(id: string){
        return this.http
            .get<Fornecedor>(`${this.urlServiceV1}fornecedores/${id}`, this.ObterAuthHeaderJson())
            .pipe(catchError(this.serviceError));
    }

    editarFornecedor(fornecedor: Fornecedor){
        return this.http
            .put(this.urlServiceV1 + `fornecedores/${fornecedor.id}`, 
                fornecedor, this.ObterAuthHeaderJson())
            .pipe(catchError(this.serviceError));
    }
    
    registrarFornecedor(fornecedor: Fornecedor){
        return this.http
            .post(this.urlServiceV1 + "fornecedores", fornecedor, this.ObterAuthHeaderJson())
            .pipe(
                map(super.extractData),
                catchError(super.serviceError));
    }

    excluirFornecedor(fornecedor: Fornecedor){
        return this.http
            .delete(this.urlServiceV1 + "fornecedores/"+ fornecedor.id, this.ObterAuthHeaderJson())
            .pipe(map(this.extractData), catchError(this.serviceError));
    }

    atualizarEndereco(endereco: Endereco){
        return this.http
            .put(`${this.urlServiceV1}fornecedores/endereco/${endereco.id}`, endereco, this.ObterAuthHeaderJson())
            .pipe(catchError(this.serviceError));
    }

    obterCep(cep: string){
        return this.http
            .get<ConsultaCep>(`https://viacep.com.br/ws/${cep}/json/`)
            .pipe(catchError(this.serviceError));
    }
}