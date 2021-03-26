import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Fornecedor } from "../models/fornecedor";
import { FornecedorService } from "./fornecedor.service";
@Injectable()
export class FornecedorResolve implements Resolve<Fornecedor>{

    constructor(private fornecedorService: FornecedorService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.fornecedorService.obterPorId(route.params['id']);
    }

}