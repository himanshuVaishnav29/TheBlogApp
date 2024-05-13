const express=require("express");
const path=require("path");
const cookieParser=require("cookie-parser");
const userRoutes=require("./routes/userRoutes");
const blogRoutes=require("./routes/blogRoutes");
const {checkForAuthenticationCookie}=require("./middlewares/authentication");
const mongoose= require("mongoose");
const BLOG=require("./models/blogSchema");
const COMMENTS=require("./models/commentSchema");
const app=express();
require("dotenv").config();

// app.use((req, re))
  
// app.use(express.json());
// app.use(express.static(path.resolve('./public/')));
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

  
   
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>console.log("MongoDB Atlas connected"))
    .catch((err)=>console.log("Error connecting to MongoDB",err));
 
  
app.use("/user",userRoutes);   
app.use("/blog",blogRoutes);
   
app.get("/",async(req,res)=>{ 
    const currentPage = req.path; 
    const allBlogs=await BLOG.find({}).populate("createdBy");
    const allComments=await COMMENTS.find({}).populate("createdBy");    
    // console.log(allBlogs);
    // console.log("req obj",req.user);
    // console.log((req.user));
    return res.render("home",{
        user:req.user,
        currentPage, 
        allBlogs:allBlogs,
        allComments  
    });  
}); 
  
 
app.listen(process.env.PORT ,(err)=>{
    if(err)console.log("Error starting server:",err);
    else console.log(`Server listening at port ${process.env.PORT}`);
})