export class LocalStorageUtils{
    
    public obterTokenUsuario(){
        return localStorage.getItem('devio.token');
    }

    public obterUsuario(){
        return JSON.parse(localStorage.getItem('devio.user'));
    }

    public salvarDadosLocaisUsuario(response: any){
        this.salvarTokenUsuario(response.accessToken);
        this.salvarUsuario(response.userToken);
    }

    public salvarTokenUsuario(token: string){
        localStorage.setItem('devio.token', token);
    }

    public salvarUsuario(usuario: string){
        localStorage.setItem('devio.user',  JSON.stringify(usuario));
    }

    public limparDadosLocaisUsuario(){
        localStorage.removeItem('devio.token');
        localStorage.removeItem('devio.user');
    }

}