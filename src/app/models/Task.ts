import { Folder } from "./Folder";
import { User } from "./User";

export class Task{


    id_task?:number;
    task_date:Date;
    task_name:string;
    task_date_added:string;
    task_folder?:Folder;
    user_task?:User;
    is_finished?:boolean;

    constructor(id_task:number,task_date:Date,task_name:string,task_date_added:string,task_folder:Folder,user_task:User,is_finished?:boolean){
        this.id_task = id_task;
        this.task_date = task_date;
        this.task_name = task_name;
        this.task_date_added  = task_date_added;
        this.task_folder = task_folder;
        this.user_task = user_task;
        this.is_finished = is_finished;
    }
}