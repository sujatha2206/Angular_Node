import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { promise } from "protractor";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn:'root'
})
export class AuthGuard implements CanActivate{
  constructor(private auth:AuthService,private router:Router){

  }
  canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot):boolean|Observable<boolean>|Promise<boolean>{
    if(this.auth.getAuthTokenStatus()){
      return true;
    }
    this.router.navigate(['/login']);
    return false;

  }
}
