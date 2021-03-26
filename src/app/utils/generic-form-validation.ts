import { FormGroup } from '@angular/forms';

export class GenericValidator{
    constructor(private validationMessages: ValidationMessages){}

    processarMensagens(container: FormGroup) : { [key:string] : string }{
        let messages = {};
        for(let controlKey in container.controls){
            if(container.controls.hasOwnProperty(controlKey)){
                let controle = container.controls[controlKey];
                if(controle instanceof FormGroup){
                    let childMessages = this.processarMensagens(controle);
                    Object.assign(messages, childMessages);
                }else{
                    if(this.validationMessages[controlKey]){
                        messages[controlKey] = '';
                        if((controle.dirty || controle.touched) && controle.errors){
                            Object.keys(controle.errors).map(messageKey => {
                                if(this.validationMessages[controlKey][messageKey]){
                                    messages[controlKey] += this.validationMessages[controlKey][messageKey];
                                }
                            })
                        }
                    }
                }
            }
        }

        return messages;
    }
}

export interface DisplayMessage{
    [key: string] : string;
}

export interface ValidationMessages{
    [key:string] : { [key:string] : string }
}