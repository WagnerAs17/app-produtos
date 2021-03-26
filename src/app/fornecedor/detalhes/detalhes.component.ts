import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { Fornecedor } from '../models/fornecedor';

@Component({
    selector: 'app-detalhes',
    templateUrl: './detalhes.component.html'
})
export class DetalhesComponent implements OnInit{
    fornecedor: Fornecedor;
    enderecoMap;
    apiGoogleMap = "https://www.google.com/maps/embed/v1/place?q=";
    
    constructor
    (
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer
    ) { 
        this.fornecedor = new Fornecedor();
    }

    ngOnInit(): void {
        this.fornecedor = this.route.snapshot.data['fornecedor'];
        this.enderecoMap = this.sanitizer
            .bypassSecurityTrustResourceUrl(
                this.apiGoogleMap + this.enderecoCompleto()+"&key=AIzaSyCAE4op0OLUbJsILqcmVaJyt8lyNC-AYug");

        
    }

    enderecoCompleto() : string{
        return this.fornecedor.endereco.logradouro + ', ' + 
            this.fornecedor.endereco.numero +' - ' + 
            this.fornecedor.endereco.bairro + ', ' +
            this.fornecedor.endereco.cidade + ' - ' +
            this.fornecedor.endereco.estado;
    }
}
