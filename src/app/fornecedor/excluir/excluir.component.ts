import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Fornecedor } from '../models/fornecedor';

import { FornecedorService } from '../services/fornecedor.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-excluir',
    templateUrl: './excluir.component.html'
})
export class ExcluirComponent implements OnInit{
    fornecedor: Fornecedor;
    enderecoMap;
    errors: any[] = [];
    
    constructor
    (
        private route: ActivatedRoute,
        private FornecedorService: FornecedorService,
        private router: Router,
        private toast: ToastrService
    ) { 
        this.fornecedor = new Fornecedor();
    }

    ngOnInit(): void {
        this.fornecedor = this.route.snapshot.data['fornecedor'];
    }

    excluirFornecedor(){
        this.FornecedorService.excluirFornecedor(this.fornecedor)
            .subscribe(sucesso => {
                this.toast.success('Forncedor excluído com sucesso.')
                    .onHidden.subscribe(() => {
                        this.router.navigate(['fornecedores/lista-todos']);
                    })
            }, error => {
                this.toast.error("Um erro aconteceu");
            })
    }
}
