
const{validateToken}=require("../services/authentication");


function checkForAuthenticationCookie(cookieName){
    return(req,res,next)=>{
        const tokenCookieValue=req.cookies[cookieName];
        if(!tokenCookieValue){
            return next();
        }
        try{
            const userPayload=validateToken(tokenCookieValue);
            // console.log("userPayload",userPayload);
            req.user=userPayload;
            // console.log(req.user._id);
        }catch(err){
        
        }
        return next();
    }
}
module.exports={
    checkForAuthenticationCookie
}