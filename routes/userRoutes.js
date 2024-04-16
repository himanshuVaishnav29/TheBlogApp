const{Router}=require("express");
const router=Router();
const {createHmac} =require("crypto");
const USER=require("../models/userSchema");
const { createToken } = require("../services/authentication");



router.get("/signUp",(req,res)=>{
    res.render('signUp');
});


router.get("/login",(req,res)=>{
    return res.render('login');
});


router.post("/signUp",async (req,res)=>{
    const body=req.body;
    await USER.create({
        fullName:body.fullName,
        email:body.email,
        password:body.password
    });
    return res.redirect("/");
});


router.post("/login",async (req,res)=>{
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
        // console.log(user);
        const token=createToken(user);
        // console.log("token",token);
        return res.cookie('token',token).redirect("/");
    }
    catch(error){
        res.render('login',{
            error:"Invalid email or password );"
            }
        );
    }     
});


router.get("/logout",(req,res)=>{
    res.clearCookie('token').redirect("/");
})

module.exports=router;