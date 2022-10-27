import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  //private url = "http://localhost:8080/api/";
  private url = /*"http://localhost:8080/"*/"https://spring-agenda-backend.herokuapp.com/api/"
    constructor(private http:HttpClient) { }

    getUserById(id:any){
      return this.http.get(this.url + 'user/getUser/' + id,{responseType:'json',observe:'response'})
    }

 
    getUserOnline():any{
      let header = new HttpHeaders().set(
        'authorization', 'Bearer '+localStorage.getItem('token')
      )
      return this.http.get(this.url + 'user/admin/viewConnectedUsers',{headers:header,responseType:'json',observe:'response'})
    }
}
