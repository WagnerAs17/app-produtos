import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

import { LocalStorageUtils } from '../../utils/localstorage';
import { BaseGuard } from '../../utils/service/base.guard';

@Injectable()
export class FornecedorGuard extends BaseGuard implements CanActivate {
    
    constructor(protected router: Router){ super(router);}

    canActivate(route: ActivatedRouteSnapshot) 
    {
      return super.validarClaims(route);
    }
}
