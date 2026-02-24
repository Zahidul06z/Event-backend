import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description : {
        type : String,
        required : true
    },
    title : {
        type : String,
        required : true
    },
    image : {
        type : String,
    },
    video : {
        type : String,
    },
    comment : [{
        userID : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        userName : {
            type : String,
            required : true
        },
        comment : {
            type : String,
            required : true
        }
    }]
}, {
  timestamps: true
})

const Blog = mongoose.model("Blog",blogSchema)

export default Blog