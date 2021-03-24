import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated=false;
private token:string;
private authStatusListner = new Subject<boolean>();
tokenTimer:any;
private userId:string;
  constructor(private http:HttpClient,private router:Router) { }
  getToken(){
    return this.token;
  }
  getUserId(){
    return this.userId;
  }
  getAuthTokenStatus(){
    console.log("authin",this.isAuthenticated);
    return this.isAuthenticated;
  }
  getAuthStatusListner(){
   return this.authStatusListner.asObservable();
  }
  createUser(email:string,passWord:string){
    const user:AuthData={
      email:email,
      password:passWord
    }
    this.http.post('http://localhost:3005/api/user/signup',user).subscribe((res)=>{
      //this.router.navigate(['/login'])
      console.log(res);
      this.router.navigate(['/login']);
    },err=>{
      this.authStatusListner.next(false);
    })
  }
  loginUser(email:string,passWord:string){
    const user:AuthData={
      email:email,
      password:passWord
    }
    this.http.post<{token:string,expiresIn:number,userId:string}>('http://localhost:3005/api/user/login',user).subscribe((res)=>{
      //this.router.navigate(['/login'])
      const token = res.token;
      this.token = token;
      if(token){
        const expiresInDuration=res.expiresIn;
       this.setAuthInterval(expiresInDuration);


        this.isAuthenticated=true;
        this.authStatusListner.next(true); //we need to pause info anyonewho is interseted
        this.userId=res.userId;
        const date = new Date();
        const expiredDate=new Date(date.getTime()+expiresInDuration*1000);
        console.log(expiredDate);
        this.saveAuthData(token,expiredDate,this.userId);
        this.router.navigate(['/'])
      }

      console.log(res);
    },err=>{
      this.authStatusListner.next(false)
    })
  }

  logOut(){
    this.token =null;
    this.isAuthenticated=false;
    this.authStatusListner.next(false);
    this.userId=null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);

  }
  private setAuthInterval(duration:number){
    console.log("setting timer",duration);
    this.tokenTimer = setTimeout(()=>{
      this.logOut();
    },duration*1000);
  }
  private saveAuthData(token:string,expirationDuration:Date,userId:string){
    localStorage.setItem("token",token);
    localStorage.setItem("expiration",expirationDuration.toISOString());
    localStorage.setItem("userId",userId);
  }
  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }
  private getAuthData(){
    const token=localStorage.getItem("token");
    const expiration=localStorage.getItem("expiration");
    const userId=localStorage.getItem("userId");
    if(!token || !expiration){
      return;
    }
    return{
      token:token,
      expiration:new Date(expiration),
      userId:userId
    }
  }
  autoAuthUser(){
   const authInformation= this.getAuthData();
   if(!authInformation){
     return;
   }
   const date=new Date();
   const expiresInDura=authInformation.expiration.getTime() - date.getTime();
   console.log("auth info",authInformation,expiresInDura);
   if(expiresInDura >0){
     this.token = authInformation.token;
     this.isAuthenticated=true;
     this.setAuthInterval(expiresInDura/1000);
     this.authStatusListner.next(true);
     this.userId = authInformation.userId;

   }
  }
}
