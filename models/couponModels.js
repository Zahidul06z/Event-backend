// models/Coupon.js
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    coupon: { 
        type: String,
        required: true,
        unique: true 
    },
    discount: {
        type: Number, 
        required: true 
    }, // e.g., 20 = 20%
    expiresAt: {
        type: Date, 
        required: true 
    }
});

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon
