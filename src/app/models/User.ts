export class User {

    id_user?: number;
    city : string;
    date_of_birth: Date;
    mail: string;
    name:string;
    password:string;
    surname:string;
    province:string;
    username:string;
    
    constructor (
        city:string,date_of_birth:Date,mail:string,name:string,password:string,surname:string,province:string,username:string
    ){
        this.city = city;
        this.date_of_birth = date_of_birth;
        this.mail = mail;
        this.name = name;
        this.password = password;
        this.surname = surname;
        this.province = province;
        this.username = username;
    }


}