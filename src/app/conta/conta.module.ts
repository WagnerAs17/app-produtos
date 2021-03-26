import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CustomFormsModule } from 'ngx-custom-validators';

import { LoginComponent } from './login/login.component';
import { ContaRoutingModule } from './conta-routing.module';
import { CadastroComponent } from './cadastro/cadastro.component';
import { ContaAppComponent } from './conta-app.component';
import { ContaService } from './services/conta.service';
import { ContaGuard } from './services/conta.guard';
@NgModule({
    declarations: [
        ContaAppComponent,
        CadastroComponent, 
        LoginComponent],
    imports: [ 
        CommonModule,
        ContaRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        CustomFormsModule
    ],
    exports: [],
    providers: [
        ContaService,
        ContaGuard
    ],
})
export class ContaModule {}