const{Router}=require("express");

const router=Router();

router.get("/addNewBlog",(req,res)=>{
    return res.render('addBlog',{
        user:req.user
    })
})


module.exports=router;