const express =require('express');
const multer=require('multer');
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const PostModel= require('../models/post');



const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backened/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});
  router.delete('/:id',checkAuth,(req,res,next)=>{
  PostModel.deleteOne(
    {_id:req.params.id,creator:req.userData.userId}
  ).then(result=>{
    console.log(result);
    if(result.n > 0){
    res.status(200).json({
      msg:"deleted successfully"
    })
  }else{
    res.status(401).json({
      msg:"Not Authorised"
    })
  }
  }).catch(err=>{
    console.log(err);
  })

})
router.post('',checkAuth,multer({ storage: storage }).single("image"),(req,res,next)=>{

 const url = req.protocol + "://" + req.get("host");
 console.log("url",url);
 console.log("file",req.file);
 console.log(req.userData);
  const post = new PostModel({
    title:req.body.title,
    content:req.body.content,
    imagePath:url +"/images/"+req.file.filename,
   creator:req.userData.userId
  })


 post.save().then((createdPosts)=>{
  res.status(201).json({
    msg:'post added successfully',
    post:{
      ...createdPosts,
      id:createdPosts._id
    }
  })
}


 )





})
router.get('/:id',(req,res,next)=>{
PostModel.findById(req.params.id).then((post)=>{
  if(post){
    res.status(200).json(post)
  }else{
    res.status(404).json({msg:'Post not found'})
  }
})
})
router.get('',(req,res,next)=>{
  // PostModel.find((err,documents)=>{

  // });
  const pageSize= +req.query.pageSize;
  const currentPage = +req.query.page;
  let fetchedPosts;
  const postQuery = PostModel.find();
  if(pageSize && currentPage){
    postQuery.skip(pageSize * (currentPage -1)).limit(pageSize)
  }
  postQuery.then(documents=>{
    fetchedPosts=documents;
    return PostModel.count();
  }).then(count=>{
    res.status(200).json({
      msg:'posts fetched successfully',
    posts:fetchedPosts,
    maxCount:count
    })
  })
})

router.put('/:id',checkAuth,multer({storage:storage}).single("image"),(req,res,next)=>{

    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }
    console.log(imagePath)

  const post = new PostModel({ // this will create new id also,so u need to replace existid
    _id:req.body.id,
    title:req.body.title,
    content:req.body.content,
    imagePath:imagePath,
    creator:req.userData.userId
  })
  PostModel.updateOne({_id:req.params.id,creator:req.userData.userId},post).then( (response)=>{
    if(response.nModified > 0){
    console.log(response)
    res.status(200).json({
    msg:"updated successfully"
  })
}else{
  res.status(401).json({
    msg:"Not Authorised"
  })
}
}).catch(err=>{
  console.log(err);
})
})
module.exports=router;
