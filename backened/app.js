const express =require('express');
const app =express();
const postRouter= require('./routes/posts');
const userRouter = require('./routes/users');
const mongoose=require('mongoose');
const path=require('path');

 const bodyparser=require('body-parser');
app.use(bodyparser.json());
 app.use(bodyparser.urlencoded({extended:false}))
 app.use("/images",express.static(path.join("backened/images")));
//or
const options = {
   useNewUrlParser: true,
   useUnifiedTopology: true,
    useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000,// Close sockets after 45 seconds of inactivity
 family: 4 // Use IPv4, skip trying IPv6
 };

mongoose.connect('
                //mongodb cluster url',options)
.then(()=>{
  console.log("connected to database");
}).catch(()=>{
  console.log('connection failed');
})



// app.use(express.json());//{}
// app.use(express.urlencoded({extended:false}));

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers',
  'Origin,X-Requested-With,Content-Type,Accept,Authorization');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,PUT,OPTIONS')
  next();
})


app.use('/api/posts',postRouter);
app.use('/api/user',userRouter);
module.exports = app;
