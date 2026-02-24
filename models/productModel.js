import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title : {
    type : String,
    required : true
  },
  price : {
    type : Number,
    required : true
  },
  description : {
    type : String,
    required : true
  },
  image: {
    type : String,
    required : true
  },
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    score: {
      type: Number,
      min: 0,
      max: 5,
      required: true
    },
    name : {
      type : String,
      required: true
    },
    reviwe : {
      type : String,
      required: true
    },
    
  }],
  average: {
    type: Number,
    default : 0
  },
  category: {
    type : String,
    required : true
  },
  stock: {
    type : Number,
    required : true
  }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
