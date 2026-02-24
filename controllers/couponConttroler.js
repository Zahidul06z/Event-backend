import Coupon from "../models/couponModels.js";
import Credential from "../models/credentialModel.js";
import User from "../models/userModel.js";
import cron from "node-cron";

const addCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { coupon, discount, expiresAt } = req.body;

    // Validate input
    if (!coupon || !discount || !expiresAt) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Unique coupon check 
    
    const notUnique = await Coupon.findOne({coupon})
    if (notUnique) {
        return res.status(409).json({ error: 'Coupon already exists. Please use a unique coupon code.' });
    }



    // Validate discount is a number
    if (isNaN(discount) || discount <= 0) {
      return res.status(400).json({ error: 'Discount must be a positive number.' });
    }

    // Validate date
    const expiryDate = new Date(expiresAt);
    if (isNaN(expiryDate.getTime())) {
      return res.status(400).json({ error: 'Invalid expiration date.' });
    }

    const user = await User.findById(id) || await Credential.findById(id) ;
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (!req.user || user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You are not authorized to perform this action.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    // Create and save the coupon
    const newCoupon = new Coupon({
      coupon,
      discount,
      expiresAt: expiryDate,
    });

    await newCoupon.save();

    return res.status(200).json({ message: 'Coupon created successfully.' });
  } catch (error) {
    console.error('Coupon creation error:', error.message);
    res.status(500).json({ error: 'Coupon creation failed due to server error.' });
  }
};

const couponApply = async (req, res) => {
  try {
    const { coupon } = req.body;

    const getCoupon = await Coupon.findOne({ coupon }); 

    if (!getCoupon) {
      return res.status(404).json({ error: "Invalid coupon code" });
    }

    if (new Date() > getCoupon.expiresAt) {
      return res.status(400).json({ error: "Coupon has expired" });
    }

    return res.json({
      message: "Coupon applied",
      discount: getCoupon.discount,
    });

  } catch (error) {
    return res.status(500).json({ error: "Server error while applying coupon" });
  }

}

// Cron job: runs daily at midnight
cron.schedule("0 0 * * *", async () => {
  const now = new Date();
  await Coupon.deleteMany({ expiresAt: { $lt: now } });
  console.log("Deleted expired coupons");
});


export { addCoupon,couponApply }