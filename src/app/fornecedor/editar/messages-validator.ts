import { ValidationMessages } from '../../utils/generic-form-validation';


export const validationMessages: ValidationMessages = {
    nome: {
      required: 'Informe o seu nome'
    },
    documento: {
      required: 'Informe o seu documento',
      cpf: 'CPF em formato inválido',
      cnpj: 'CNPJ em formato inválido',
    },
    tipoFornecedor: {
      required: 'Informe o tipo de fornecedor'
    },
    logradouro: {
      required: 'Informe o logradouro'
    },
    numero:{
      required: 'Informe o número'
    },
    bairro: {
      required: 'Informe o bairro'
    },
    cep: {
      required: 'Informe o cep'
    },
    cidade: {
      required: 'Informe a cidade'
    },
    estado: {
      required: 'Informe o estado'
    }
  }