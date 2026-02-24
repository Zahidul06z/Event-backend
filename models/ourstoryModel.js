import mongoose from 'mongoose'

const storySchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description : {
        type : String,
        required : true
    },
    image : {
        type : String,
    },
    video : {
        type : String,
    }
}, {
  timestamps: true
})

const Story = mongoose.model("Story",storySchema)

export default Story