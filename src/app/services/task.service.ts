import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
 private url = "http://localhost:8080/api/"
 //private url = /*"http://localhost:8080/"*/"https://spring-agenda-backend.herokuapp.com/api/" 
 constructor(private http:HttpClient) { }



  createTask(task:any):any{
    let header = new HttpHeaders().set(
      'authorization', 'Bearer '+localStorage.getItem('token')
    )

    return this.http.post(this.url +'task/createTask',task,{headers:header,responseType:'json',observe:'response'});
  
  }

  finishTask(id:any):any{

    let header = new HttpHeaders().set(
      'authorization', 'Bearer '+localStorage.getItem('token')
    )

    return this.http.put(this.url + "task/finishTask/"+id,null,{headers:header,observe:'response',responseType:'json'});
  }

  deleteTask(id:any):any{
    let header = new HttpHeaders().set(
      'authorization', 'Bearer '+localStorage.getItem('token')
    )

    return this.http.delete(this.url + 'task/deleteTask/'+id,{headers:header,responseType:'json',observe:'response'});
  }


  editTask(task:any,id:any):any{

    let header = new HttpHeaders().set(
      'authorization', 'Bearer '+localStorage.getItem('token')
    )


    return this.http.put(this.url + 'task/editTask/'+id,task,{params:{task_name: task.task_name, task_date:task.task_date},headers:header,responseType:'json',observe:'response'})

  }
}
