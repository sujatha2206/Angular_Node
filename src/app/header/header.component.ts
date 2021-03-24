import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls:['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
  public isUserAuthenticated=false;
  private subscibe:Subscription;
  constructor(private auth:AuthService){}
  ngOnInit(){
    this.isUserAuthenticated=this.auth.getAuthTokenStatus();
    this.auth.getAuthStatusListner().subscribe(data=>{
      console.log("auth status in header",data);
      this.isUserAuthenticated = data;
    })
  }
  onLogout(){
    this.auth.logOut();
    console.log("logout status in header",this.isUserAuthenticated);
  }
  ngOnDestroy(){
    this.subscibe.unsubscribe();

  }
}
