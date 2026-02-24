import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type : String,
    required : true 
  },
  phone: {
    type : String,
    required : true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    title:  {
      type : String,
      required : true
    },
    price:  {
      type : Number,
      required : true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image:  {
      type : String,
      required : true
    },
    category:  {
      type : String,
      required : true
    },
    total : {
      type : Number,
      required : true
    }
  }],
  shippingAddress: {
    delivaryAddress: { type: String, required: true },
    city: { type: String, required: true },
    postCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['sslcommerz', 'cod']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid','failed','cancle'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending','conform', 'shipped', 'delivered'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  trackMessage : [
    {
      title : {
        type : String,
        required : true,
      },
      description : {
        type : String,
        required : true,
      },
      createdAt: {
        type: Date,
        default: Date.now  
      }
    }
  ],
 // for SSLCommerz
  sslTransactionId : {
    type : String
  },
  transactionId : {
    type: String,
  },
  bankTransactionId : {
    type: String,
  },
  cardType : {
    type: String,
  },
  paymentType : {
    type : String
  }
 
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order