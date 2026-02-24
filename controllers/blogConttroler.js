import fs from 'fs';
import path from 'path';
import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";
import Credential from '../models/credentialModel.js';

const createBlog = async (req,res)=>{
    try {
        const userId = req.params.id;
        const {description,title} = req.body;
        const videos = req.files?.video?.[0];
        const image = req.files?.image?.[0];

        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({error : 'User not found'})
        }

        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }

        if(user.role !== 'admin'){
            return res.status(403).json({error : 'You are not valide user to create blog'})
        }

        if(image && videos){
            const newBlog = new Blog({
                userId : user._id,
                description,
                title,
                image : image?.filename,
                video : videos?.filename 
            })

            await newBlog.save()

            return res.status(201).json({meaasge : "Blog create successfully"})
        }
        else if(videos){
            const newBlog = new Blog({
                userId : user._id,
                description,
                title,
                video : videos.filename
            })

            await newBlog.save()

            return res.status(201).json({meaasge : "Blog create successfully"})
        }else{
            const newBlog = new Blog({
                userId : user._id,
                description,
                title,
                image : image.filename
            })

            await newBlog.save()

            return res.status(201).json({meaasge : "Blog create successfully"})
        }

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred in Upload Blog",
            error: error.message
        });
    }
}

const getBLog = async(req,res)=>{
    try {
      
        const blog = await Blog.find({}).sort({createdAt : -1})

        if (!blog) {
            return res.status(404).json({ error: "Don't have any blog" });
        }


        return res.status(201).send(blog)

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred in Get All The Blog",
            error: error.message
        });
    }
}

const getSingleBLog = async(req,res)=>{
    try {
        
        const blogId = req.params.id

        const blog = await Blog.findById(blogId)

        if (!blog) {
            return res.status(404).json({ error: "Don't have any blog" });
        }

        return res.status(201).send(blog)

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred in Get Single Blog",
            error: error.message
        });
    }
}

const deleteBlog = async(req,res)=>{
    try {
        const blogId = req.params.id;
        const adminId = req.user._id;

        // console.log(blog)

        const user = await User.findById(adminId)
        if(!user){
            return res.status(404).json({error : 'User not found'})
        }

        const blog = await Blog.findById(blogId)
        if(!blog){
            return res.status(404).json({error : 'Blog not found'})
        }

        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }

        if(user.role !== 'admin'){
            return res.status(403).json({error : 'You are not valide user to delete this blog'})
        }

        if(blog?.image){
            if(!blog?.image || blog?.image.includes('..')){
                return res.status(400).json({ message: 'Invalid image file names' });
            }

            const imagePath = path.join('uploads', 'blog', 'images', blog?.image);

            const deleteFile = (filePath) => {
                if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) console.error(`❌ Failed to delete: ${filePath}`, err);
                    else console.log(`✅ Deleted: ${filePath}`);
                });
                } else {
                console.warn(`⚠️ File not found: ${filePath}`);
                }
            };

            deleteFile(imagePath);
            
        }else{
            if (!blog?.video || blog?.video.includes('..')) {
                return res.status(400).json({ message: 'Invalid video file names' });
            }

            const videoPath = path.join('uploads', 'blog', 'videos', blog?.video);

            const deleteFile = (filePath) => {
                if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) console.error(`❌ Failed to delete: ${filePath}`, err);
                    else console.log(`✅ Deleted: ${filePath}`);
                });
                } else {
                console.warn(`⚠️ File not found: ${filePath}`);
                }
            };

            
            deleteFile(videoPath);
        }

        await Blog.findByIdAndDelete(blogId)
        return res.status(200).json({message : "successfull"})

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred in Delete Blog",
            error: error.message
        });
    }
}

const commentBlog = async(req,res)=>{
    try {

        const {comment} = req.body;
        const {userId,blogId} = req.params

        const user = await User.findById(userId) || await Credential.findById(userId);
        if(!user){
           return res.status(404).json({error : 'User not found'}) 
        }

        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You are not valid user' });
        }

        const blog = await Blog.findById(blogId);
        if(!blog){
           return res.status(404).json({error : 'Blog not found'}) 
        }

        blog.comment.push({
            userID : user._id,
            userName : user.name,
            comment
        })

        await blog.save()

        return res.status(200).json({ message: "Comment Posted", comments : blog?.comment  })
        
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred in when user comment on blog",
            error: error.message
        });
    }
}

export { createBlog,getBLog,getSingleBLog,deleteBlog,commentBlog }