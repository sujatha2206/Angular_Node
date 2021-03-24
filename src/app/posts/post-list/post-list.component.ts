import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { Router } from "@angular/router";
import { PageEvent } from "@angular/material";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { AuthService } from "src/app/auth/auth.service";



@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading=false;
  totalPosts=0;
  postsPerPage=2;
  userId:string;
  currentPage=1;
  pageSizeOptions:number[]=[1,2,5,10];
  isUserAuthenticated=false;
  constructor(public postsService: PostsService,private route:Router,private auth:AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.userId=this.auth.getUserId();
  this.postsService.getPosts(this.postsPerPage,this.currentPage);
   this.isUserAuthenticated=this.auth.getAuthTokenStatus();
    console.log("is user authinlist",this.isUserAuthenticated);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData:{posts: Post[],maxCount:number}) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts=postData.maxCount;
      });
      this.auth.getAuthStatusListner().subscribe(data=>{
        console.log("authstatus in postlist",data);
        this.isUserAuthenticated = data;
        this.userId = this.auth.getUserId();
      })
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();

  }
  onDelete(postId:string){
    this.postsService.deletePosts(postId).subscribe(()=>{
      this.postsService.getPosts(this.postsPerPage,this.currentPage)
    });
  }
  onChangedPage(pageData:PageEvent){
    this.isLoading=true;
    console.log(pageData);
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage,this.currentPage);

  }
}
