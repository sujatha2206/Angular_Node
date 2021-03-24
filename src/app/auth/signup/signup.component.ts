import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit,OnDestroy {
authStatusSub:Subscription;
  constructor(private auth:AuthService) { }
  isLoading=false;
  ngOnInit() {
   this.authStatusSub= this.auth.getAuthStatusListner().subscribe(status=>{
      this.isLoading=false;
    });
  }
  onSignup(form:NgForm){
this.isLoading=true;
  console.log(form);
  if(form.invalid){
    return;
  }
  this.auth.createUser(form.value.emailInput,form.value.passWord);

  }

ngOnDestroy(){
this.authStatusSub.unsubscribe();
}
}
