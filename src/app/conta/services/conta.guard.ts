import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageUtils } from 'src/app/utils/localstorage';

import { CadastroComponent } from '../cadastro/cadastro.component';
@Injectable()
export class ContaGuard implements CanDeactivate<CadastroComponent>, CanActivate{
    
    localStorateUtils = new LocalStorageUtils();

    constructor(private router: Router){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        if(this.localStorateUtils.obterTokenUsuario()){
            this.router.navigate(['/home']);
        }

        return true;
    }
    
    canDeactivate(component: CadastroComponent){
        if(component.mudancasNaoSalvas){
            return window.confirm('Tem certeza que deseja abandonar o formulário? ');
        }

        return true;
    }
}