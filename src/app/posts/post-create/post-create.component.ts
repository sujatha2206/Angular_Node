import { Component, OnInit } from "@angular/core";
import {  FormGroup, FormControl, Validators } from "@angular/forms";
import { PostsService } from "../posts.service";
import {mimeType} from './mime-type.validator';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Post } from "../post.model";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit{
  enteredTitle = "";
  enteredContent = "";
  private mode='create';
  isLoading=false;
   postId:string;
   post:Post;
   imagePreview:string;
   form:FormGroup;
  constructor(public postsService: PostsService,public route:ActivatedRoute) {}
  ngOnInit(){
this.form = new FormGroup({
  title:new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]}),
  content:new FormControl(null,{validators:[Validators.required]}),
  image:new FormControl(null,{
    validators: [Validators.required],
    asyncValidators:[mimeType]})
})
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
        if(paramMap.has('postId')){
            this.mode='edit';
            this.postId=paramMap.get('postId');
            this.isLoading =true;
             this.postsService.getPost(this.postId).subscribe((postData)=>{
               this.isLoading =false;
              this.post={id:postData._id,title:postData.title,content:postData.content,imagePath:postData.imagePath,creator:postData.creator};
              this.form.setValue({
                title:this.post.title,
                content:this.post.content,
                image:this.post.imagePath

              })
            });
        }else{
          this.mode='create';
          this.postId=null;

        }
    })
  }
  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading=true;
    if(this.mode==="create"){
    this.postsService.addPost(this.form.value.title, this.form.value.content,this.form.value.image);
    }else{
    this.postsService.updatePosts(this.postId,this.form.value.title,this.form.value.content,this.form.value.image);

    }
    this.form.reset();
  }
  onImagePicked(even:Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image:file });
   this.form.get('image').updateValueAndValidity();
    console.log(file);
    console.log(this.form);
    const reader = new FileReader();
    console.log(reader);
    reader.onload =()=>{
      this.imagePreview = (reader.result) as string;
      console.log(this.imagePreview);
    }
    reader.readAsDataURL(file);

    }
}
