const{Router}=require("express");
const router=Router();
const {createHmac} =require("crypto");
const USER=require("../models/userSchema");
const BLOG=require("../models/blogSchema");
const { createToken } = require("../services/authentication");



router.get("/signUp",(req,res)=>{
    const currentPage = req.path;
    res.render('signUp',{
        currentPage,
        error:"" 
    });
});


router.get("/login",(req,res)=>{
    const currentPage = req.path;
    return res.render('login',{
        currentPage
    });
});

 
router.post("/signUp",async (req,res)=>{
    const currentPage=req.path;
    let errorMessage="";
    try{
        const body=req.body;
        const existingUser = await USER.findOne({ email: body.email }); 
        if (existingUser) { 
            return res.render("signUp",{error:"User already exists",currentPage});
            // throw new Error("User already exists");
        }
        console.log(existingUser);
        if (body.password.length < 5) { 
            // throw new Error("Password too short");
            return res.render("signUp",{error:"Password too short",currentPage});
        } 
        await USER.create({
            fullName:body.fullName,
            email:body.email,
            password:body.password
        });
        return res.redirect("/user/login");
    }catch(err){
        // errorMessage = err.message; 
        console.log(err);
        return res.render("signUp",{
            // error:errorMessage,
            currentPage
        });
    } 
});
 

router.post("/login",async (req,res)=>{
    const currentPage = req.path;
    try{
        const {email,password}=req.body;
        const user=await USER.findOne({email});
    
        if(!user){
            throw new Error("USER NOT FOUND");
        } 
        const salt=user.salt;
        const hashedPassword=user.password;
        const userProvidedHash=createHmac('sha256',salt)
            .update(password)
            .digest("hex");
    
    
        // console.log("hashed pass",hashedPassword);
        // console.log("user pass",userProvidedHash);
        if(hashedPassword!==userProvidedHash){
            throw new Error("Invalid password");
        }  
        const HOUR = 3600000
        // console.log(user);
        const token=createToken(user);
        const cookieOptions = {
            expires: new Date(Date.now() + HOUR), 
            httpOnly: true 
        };
      
        return res.cookie('token',token,cookieOptions).redirect("/");
    }
    catch(error){
        res.render('login',{
            error:"Invalid email or password );",
            currentPage
            }
        );
    }      
});
  

router.get("/logout",(req,res)=>{
    res.clearCookie('token').redirect("/");
});


//user Profile
router.get("/:userId",async(req,res)=>{
    const currentPage=req.path;
    const userBlogs=await BLOG.find({createdBy:req.params.userId});
    const searchedUser=await USER.findById(req.params.userId);
    
    res.render('userProfile',{
            userBlogs,
            user:req.user,
            searchedUser,
            currentPage
        }
    );
});

module.exports=router;