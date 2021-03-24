import { Component, OnInit, OnDestroy } from '@angular/core';
import {  NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {
  authStatusSub:Subscription;
  constructor(private authService:AuthService) { }
  isLoading=false;
  ngOnInit() {
    this.authStatusSub= this.authService.getAuthStatusListner().subscribe(status=>{
       this.isLoading=false;
     });
   }
  onLogin(form:NgForm){
    this.isLoading=true;
  console.log(form);

  if(form.invalid){
    return;
  }

  this.authService.loginUser(form.value.emailInput,form.value.password)

}
ngOnDestroy(){
  this.authStatusSub.unsubscribe();
  }
}
