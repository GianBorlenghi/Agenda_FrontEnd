export class ChangePasswordDTO {

    private actualPassword:string;
    private newPassword:string;

    constructor(actualPassword:string,newPassword:string){

        this.actualPassword = actualPassword;
        this.newPassword = newPassword;
    }
}