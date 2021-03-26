import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario';

import { BaseService } from '../../utils/service/base.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Injectable()
export class ContaService  extends BaseService{

    constructor(private http: HttpClient){ super(); }

    registrarUsuario(usuario: Usuario) : Observable<Usuario>{
        let response = this.http
            .post(this.urlServiceV1 + 'nova-conta', usuario, this.obterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError)
            );

        return response;
    }

    login(usuario: Usuario): Observable<Usuario>{
        let response = this.http
            .post(this.urlServiceV1 + 'entrar', usuario, this.obterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError)
            )

        return response;
    }

}