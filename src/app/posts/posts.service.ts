import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import{map} from 'rxjs/operators';
import { Router } from '@angular/router';
import { Post } from './post.model';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { stringify } from 'querystring';


@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts:Post[],maxCount:number}>();
  constructor(private http:HttpClient,private router:Router){

  }
  getPosts(postPerPage:number,currentPage:number) {
    const queryParams=`?pageSize=${postPerPage}&page=${currentPage}`;
    return this.http.get<{msg:string,posts:any,maxCount:number}>('http://localhost:3005/api/posts'+queryParams).pipe(map((res)=>{
    return {posts:res.posts.map(post => {
      return {
        title:post.title,
        content:post.content,
        id:post._id,
        imagePath:post.imagePath,
        creator:post.creator
      }
    }),maxCount:res.maxCount};
    })).subscribe((transformedPosts)=>{
      this.posts=transformedPosts.posts;
     this.postsUpdated.next({posts:[...this.posts],maxCount:transformedPosts.maxCount})
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
getPost(id:string){
//     return {...this.posts.find(post=> post.id===id)}
return this.http.get<{_id:string,title:string,content:string,imagePath:string,creator:string}>(`http://localhost:3005/api/posts/${id}`)
}
  addPost(title: string, content: string,image:File) {
    const post = new FormData();
    post.append("title",title);
    post.append("content",content);
    post.append("image",image,title); //here extra fie name also
    this.http.post<{msg:string,post:Post}>('http://localhost:3005/api/posts',post).subscribe((res)=>{
      // const post:Post ={id:res.post.id,title:title,content:content,imagePath:res.post.imagePath};
      // this.posts.push(post);
      // this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/'])
    })

  }
  updatePosts(id:string,title:string,content:string,image:File | string){
    console.log("id ",id,"title ",title,"content ",content);
    let post:Post | FormData;
    if(typeof image === "object"){
     post = new FormData();
     post.append("id",id);
    post.append("title",title);
    post.append("content",content);
    post.append("image",image,title); //here extra fie name also
    }else{
      post = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator:null
      };
    }

    this.http.put(`http://localhost:3005/api/posts/${id}`,post).subscribe((res)=>{

      // const updatedPosts = [...this.posts];
      // const oldINdex = updatedPosts.findIndex(p=> p.id=== id);
      // const post: Post = {
      //   id: id,
      //   title: title,
      //   content: content,
      //   imagePath: ""
      // };
      // updatedPosts[oldINdex]=post;
      // this.posts =updatedPosts;
      // this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/'])
    })
  }
  deletePosts(postId:string){
    return this.http.delete(`http://localhost:3005/api/posts/${postId}`)

  }
}
