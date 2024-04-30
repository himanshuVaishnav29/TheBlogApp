const{Router}=require("express");
const multer=require("multer");
const path=require("path");
const BLOG=require("../models/blogSchema");
const COMMENT=require("../models/commentSchema");
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
    const comments=await COMMENT.find({blogId:req.params.id}).populate("createdBy");
    // console.log(currentBlog);
    // console.log(req.user);
    return res.render('blog',{
        user:req.user,
        currentBlog,
        currentPage, 
        comments
     
    });
});
   


router.post("/addNewBlog", upload.single('coverImage'), async (req, res) => {
    try {
        const body = req.body;
        let coverImageUrl;
        if (req.file) {
            coverImageUrl = `/uploads/${req.file.filename}`;
        } else {
            coverImageUrl = "/images/defaultBlogImage.jpg";
        }

        const blog = await BLOG.create({
            title: body.title,
            body: body.description,
            coverImageUrl: coverImageUrl,
            createdBy: req.user._id
        });

        return res.redirect(`/blog/${blog._id}`);
    } catch (err) {
        console.log("Error adding new blog in /addNewBlog", err);
        res.end("Error adding new blog in /addNewBlog");
    }
});

 
 //my blogs 
router.get("/",async(req,res)=>{
    try{
        // console.log(req.user);
        // const currentUser=req.user._id;
        const currentPage=req.path;
        const allBlogs=await BLOG.find({createdBy:req.user._id}).populate("createdBy");
        // console.log("Allblogs",allBlogs);     
        // console.log("curr user");
        return res.render('myBlogs',{
            allBlogs,
            currentPage,
            user:req.user
        });    
        // return res.render('myBlogs');
    }catch(err){
        console.log("err in /",err);
    }
}); 
  
 
router.post("/comment/:blogId",async(req,res)=>{
    try{
        const comment=await COMMENT.create({
            content:req.body.content,
            blogId:req.params.blogId,
            createdBy:req.user 
        });
        // console.log(comment);
        return res.redirect(`/blog/${req.params.blogId}`);
    }catch(err){
        console.log("Error in comments/blogId",err);
    } 
}); 



router.get("/update/:blogId",async(req,res)=>{
    try{
        const user=req.user;
        const currentPage=req.path;
        const blogId=req.params.blogId;
        // console.log(blogId);
        const blog=await BLOG.findById({_id:blogId});
        // console.log(blog);
        return res.render('updateBlog',{
            blog,
            currentPage,
            user 
        });
    }
    catch(err){
        console.log("err hello");
        res.end();
    }
});


router.post("/update/:blogId", upload.single('coverImage'), async (req, res) => {
    try {
        const body = req.body;
        const blogId = req.params.blogId;
        
        let updateFields = {
            title: body.title,
            body: body.description
        };

        // Add coverImageUrl if it exists
        if (req.file) {
            updateFields.coverImageUrl = `/uploads/${req.file.filename}`;
        }

        const blog = await BLOG.findByIdAndUpdate(
            blogId,
            updateFields,
            { new: true } // To return the updated document
        ).populate("createdBy");

        console.log(blog);
        return res.redirect("/");
    } catch (err) {
        console.log("Error in post /update/:blogId", err);
        return res.status(500).send("Internal Server Error");
    }
});

  
// DELETING BLOG
 router.post("/delete/:blogId",async(req,res)=>{
    try{
        const blogId=req.params.blogId;
        // res.end(blogId);
        await BLOG.findByIdAndDelete(blogId);
        console.log("Blog ",blogId," deleted successfully");
        return res.redirect("/blog");
    }catch(err){
        console.log("Error in /delete/:blogId",err);
    }
 });
 
 
module.exports=router;