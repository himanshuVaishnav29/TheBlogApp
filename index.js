const express=require("express");
const path=require("path");
const cookieParser=require("cookie-parser");
const userRoutes=require("./routes/userRoutes");
const blogRoutes=require("./routes/blogRoutes");
const {checkForAuthenticationCookie}=require("./middlewares/authentication");
const mongoose= require("mongoose");
const app=express();
require("dotenv").config();

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));



   
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>console.log("MongoDB local connected"))
    .catch((err)=>console.log("Error connecting to MongoDB",err));
 

app.use("/user",userRoutes);
app.use("/blog",blogRoutes);
 
app.get("/",(req,res)=>{
    return res.render("home",{
        user:req.user
    });  
}); 


app.listen(process.env.PORT ,(err)=>{
    if(err)console.log("Error starting server:",err);
    else console.log(`Server listening at port ${process.env.PORT}`);
})