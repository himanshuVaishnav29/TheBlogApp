const{Router}=require("express");
const multer=require("multer");
const path=require("path");
const BLOG=require("../models/blogSchema");

const router=Router();

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.resolve('./public/uploads/'))
    },
    filename:function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`)
    }
}); 
const upload=multer({storage});

router.get("/addNewBlog",async(req,res)=>{
    const currentPage = req.path;
    return res.render('addBlog',{
        user:req.user,
        currentPage
    })
});  
  
router.get("/:id",async(req,res)=>{
    const currentBlog=await BLOG.findById(req.params.id).populate("createdBy");
    const currentPage=req.path;
    // console.log(currentBlog);
    return res.render('blog',{
        user:req,res,
        currentBlog,
        currentPage
    });
});
   
 
router.post("/addNewBlog",upload.single('coverImage'),async (req,res)=>{
    const body=req.body
    const blog=await BLOG.create({
        title:body.title,
        body:body.description,
        coverImageUrl:`/uploads/${req.file.filename}`,
        createdBy:req.user._id
    });
    // console.log(body);
    // console.log(req.file);
    // return res.redirect("/");
    return res.redirect(`/blog/${blog._id}`);
  
});



module.exports=router;