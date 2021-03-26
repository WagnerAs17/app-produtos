import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgBrazil } from 'ng-brazil';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxSpinnerModule } from "ngx-spinner";

import { FornecedorRoutingModule } from './fornecedor.routing.module';
import { NovoComponent } from './novo/novo.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { ExcluirComponent } from './excluir/excluir.component';
import { ListaComponent } from "./lista/lista.component";
import { FornecedorService } from "./services/fornecedor.service";
import { FornecedorAppComponent } from './fornecedor.app.component';
import { EditarComponent } from './editar/editar.component';
import { FornecedorResolve } from './services/fornecedor.resolve';
import { FornecedorGuard } from './services/fornecedor.guard';

@NgModule({
    declarations: [
        NovoComponent,
        DetalhesComponent,
        ExcluirComponent,
        ListaComponent,
        FornecedorAppComponent,
        EditarComponent
    ],
    imports: [ 
        CommonModule, 
        FornecedorRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgBrazil,
        TextMaskModule,
        NgxSpinnerModule
    ],
    exports: [
        
    ],
    providers: [ 
        FornecedorService,
        FornecedorResolve,
        FornecedorGuard
    ],
})
export class FornecedorModule {}