import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class NoLoginGuard implements CanActivate {

  constructor(private route:Router,private authService:AuthServiceService){}

  canActivate():boolean{
    if(localStorage.getItem('token') === null){
      return true;
    }else{
      this.route.navigate(['home']);
      return false;
    }
  }
  
}
