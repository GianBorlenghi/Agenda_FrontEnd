import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from '../models/User';
import { Login } from '../models/Login';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private url = /*"http://localhost:8080/"*/"https://spring-agenda-backend.herokuapp.com/"
  isLogued:boolean;
  constructor(private http:HttpClient) {

    }


   public logIn(user:Login):any{
      return this.http.post(this.url + "api/auth/login",user);
   }

   public register(user:User){
    return this.http.post(this.url + 'api/auth/register',user,{responseType : 'json',observe:'response'});
   }
   

   public resetPassword(username:any){
    return this.http.put(this.url + 'api/auth/forgotPassword/'+username,null,{responseType : 'json',observe:'response'});
   }

   public changePassword(id:any,changePasswordDto:any){
    let header = new HttpHeaders().set(
      'authorization', 'Bearer '+localStorage.getItem('token')
    )
    return this.http.put(this.url +'api/auth/changePassword/'+id,changePasswordDto,{headers:header,responseType:'json',observe:'response'});
   }

   public logout():any{

    let header = new HttpHeaders().set(
      'authorization', 'Bearer '+localStorage.getItem('token')
    );
    header.set('Content-Type' , 'application/json')

      return this.http.post(this.url + 'api/auth/logout','',{headers:header,responseType:'text'})
  }

}
