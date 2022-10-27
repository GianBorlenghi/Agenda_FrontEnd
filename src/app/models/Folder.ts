import { User } from "./User";

export class Folder {
    id_folder?:number;
    folder_name:string;
    task_x_folder?:any[] 
    user_folder:User;

    constructor(id_folder:number,folder_name:string,task_x_folder:any[],user_folder:User){
        this.id_folder = id_folder;
        this.folder_name = folder_name;
        this.task_x_folder = task_x_folder;
        this.user_folder = user_folder;
    }
}