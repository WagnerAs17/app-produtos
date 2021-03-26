export class StringUtils{
    
    public static isNullOrEmpty(value: string) : boolean{
        return value === undefined || value === null || value.trim() === '';
    }

    public static somenteNumeros(numero: string) : string{
        return numero.replace(/[^0-9]/g, '');
    }
}