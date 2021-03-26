import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { NovoComponent } from './novo/novo.component';
import { ListaComponent } from './lista/lista.component';
import { FornecedorAppComponent } from './fornecedor.app.component';
import { EditarComponent } from './editar/editar.component';
import { ExcluirComponent } from './excluir/excluir.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { FornecedorResolve } from './services/fornecedor.resolve';
import { FornecedorGuard } from './services/fornecedor.guard';

const routes: Routes = [
    { path: '', component: FornecedorAppComponent, children: [
        { 
            path: 'adicionar-novo', 
            component: NovoComponent, 
            canActivate: [FornecedorGuard],
            data: [{ claim: { nome: 'Fornecedor', valor: 'Adicionar'}}]
        },
        { path: 'lista-todos', component: ListaComponent },
        { 
            path: 'editar/:id', component: EditarComponent,
            resolve: {
                fornecedor: FornecedorResolve
            }
        },
        { 
            path: 'excluir/:id', component: ExcluirComponent,
            resolve: {
                fornecedor: FornecedorResolve
            } 
        },
        { 
            path: 'detalhes/:id', component: DetalhesComponent,
            resolve: {
                fornecedor: FornecedorResolve
            }
        }
    ]},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FornecedorRoutingModule {}
