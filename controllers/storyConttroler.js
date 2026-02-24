import dbConnected from "../config/db/dbConnecte.js";
import Story from "../models/ourstoryModel.js";
import User from "../models/userModel.js";

const createStory = async(req,res)=>{
    try {

        dbConnected()

        const userId = req.params.id;
        const {description} = req.body;
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
            return res.status(403).json({error : 'You are not valide user to create story'})
        }

        if(image && videos){
            const newStory = new Story({
                userId : user._id,
                description,
                image : image?.filename,
                video : videos?.filename 
            })

            await newStory.save()

            return res.status(201).json({meaasge : "Story create successfully"})
        }
        else if(videos){
            const newStory = new Story({
                userId : user._id,
                description,
                video : videos.filename
            })

            await newStory.save()

            return res.status(201).json({meaasge : "Story create successfully"})
        }else{
            const newStory = new Story({
                userId : user._id,
                description,
                image : image.filename
            })

            await newStory.save()

            return res.status(201).json({meaasge : "Story create successfully"})
        }

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred in  Create Story",
            error: error.message
        });
    }
}

const getStory = async(req,res)=>{
    try {
      
        dbConnected()

        const blog = await Story.find({}).sort({createdAt : -1})
        return res.status(201).send(blog)

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred in Get All The Story",
            error: error.message
        });
    }
}

const deleteStory = async(req,res)=>{
    try {

        dbConnected()

        const storyId = req.params.id;
        const adminId = req.user._id;

        const user = await User.findById(adminId)
        if(!user){
            return res.status(404).json({error : 'User not found'})
        }

        const blog = await Story.findById(storyId)
        if(!blog){
            return res.status(404).json({error : 'Story not found'})
        }

        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }

        if(user.role !== 'admin'){
            return res.status(403).json({error : 'You are not valide user to delete this story'})
        }

        await Story.findByIdAndDelete(storyId)
        return res.status(201).json({message : "Story Delete Successfully"})

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred in Delet Story",
            error: error.message
        });
    }
}

export { createStory,getStory,deleteStory }