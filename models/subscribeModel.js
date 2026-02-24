import mongoose from 'mongoose'

const subscribeSchema = new mongoose.Schema({
    subscriberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subscriberEmail : {
        type : String,
        required : true
        
    }
},{
    timestamps : true
})


const Subscribe = mongoose.model('Subscribe',subscribeSchema)

export default Subscribe