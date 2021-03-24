import{HttpInterceptor, HttpRequest, HttpHandler} from '@angular/common/http'
import { Injectable } from '@angular/core'
import {AuthService} from './auth.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor{
  constructor(private auth:AuthService){}
intercept(req:HttpRequest<any>,next:HttpHandler){
  const authToken =this.auth.getToken();


  //clone req and send token
  const authRequest = req.clone({
    headers: req.headers.set("Authorization", "Bearer " + authToken)
  });
  return next.handle(authRequest)
}
}
//we need to inject this as a service in angular appmodule
