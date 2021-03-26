import { Component, OnInit } from '@angular/core';

import { NgxSpinnerService } from "ngx-spinner";

import { Fornecedor } from '../models/fornecedor';
import { FornecedorService } from '../services/fornecedor.service';

@Component({
    selector: 'app-lista',
    templateUrl: './lista.component.html'
})
export class ListaComponent implements OnInit{
    fornecedores: Fornecedor[];
    
    constructor
    (
        private fornecedorService: FornecedorService,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit(): void {
        this.spinner.show();
        this.fornecedorService.obterTodos()
            .subscribe(fornecedores => {
                this.fornecedores = fornecedores;
                this.spinner.hide();
            }, error => { this.spinner.hide()});
    }
}
