import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

//  private url = "http://localhost:8080/api/"
 private url = /*"http://localhost:8080/"*/"https://spring-agenda-backend.herokuapp.com/api/"
  constructor(private http:HttpClient) { }

  createFolder(folder:any):any{
    let header = new HttpHeaders().set(
      'authorization', 'Bearer '+localStorage.getItem('token')
    )

    return this.http.post(this.url + 'folder/createFolder',folder,{headers:header, responseType:'json',observe:'response'});
  }



  getTaskXFolder(id:any):any{

    let header = new HttpHeaders().set(
      'authorization', 'Bearer '+localStorage.getItem('token')
    )
  

    return this.http.get(this.url + 'folder/getTasks/'+id,{headers:header,responseType:'json'})
}

deleteFolder(id:any):any{

  let header = new HttpHeaders().set(
    'authorization', 'Bearer '+localStorage.getItem('token')
  )

  return this.http.delete(this.url +'folder/deleteFolder/'+id,{headers:header,responseType:'json',observe:'response'})

}
}
