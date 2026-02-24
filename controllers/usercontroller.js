import User from "../models/userModel.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { blacklistedTokens } from "../config/auth/passport.js";
import Order from "../models/orderModel.js";
import Credential from "../models/credentialModel.js";

const userRegistration = async(req,res) =>{
    try {
        const {name,email,password } = req.body;
        
        const user = await User.findOne({email : email});
        if(user){
            return res.status(409).json({ error: 'User already exists' });
        }
 
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password,salt)

        const newUser = new User({
            name,
            email,
            password : hashPassword
        })

        await newUser.save()

        if(newUser){
             const payload = {
                id : newUser._id,
                name : newUser.name
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn: "15d"});
            
            return res.status(201).send({
                success : true,
                message : 'User registered successfully',
                token : 'Bearer '+token,
                _id : newUser._id,
                name : newUser.name,
                role : newUser.role,
                email : newUser.email,
                

            })
        }    
    } catch (error) {
         console.error("Registration Error:", error);
        return res.status(500).json({ success: false, message: "An error occurred during Registration", error: error.message });
    }
}

const userLogin = async(req,res)=>{
    try {
        const {email,password} = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const payload = {
            id : user._id,
            name : user.name
        }
        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn: "15d"});
        
        return res.status(201).send({
            success : true,
            message : 'User Login successfully',
            token : 'Bearer '+token,
            _id : user._id,
            name : user.name,
            role : user.role,
            email : user.email,
            

        })

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "An error occurred during Login", error: error.message });
    }
}

const userLogout = async(req,res)=>{
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({
            success: false,
            message: 'Authorization header missing or malformed',
          });
        }
    
        const token = authHeader.split(' ')[1];
        blacklistedTokens.add(token);
    
        res.status(200).json({
          success: true,
          message: 'Logout successfully',
        });
      }catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({
            success: false,
             message: "An error occurred while Logout the user",
            error: error.message
        });
     }
}

const  userProfile = async(req,res)=>{
    try {
        const {id} = req.params;

        const user = await User.findById(id).select('-password') || await Credential.findById(id).select('-password');

        if(!user){
            return res.status(404).json({error : 'User not found'})
        }

        if(user?._id.toString() !== req?.user?._id.toString()){
            return res.status(403).json({ error: 'Access denied' });
        }

        return res.status(200).send(user)

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "An error occurred during get user profile", error: error.message });
    }
}

const getOrderProduct = async(req,res)=>{
    try {

        const {id} = req.params;

        const user = await User.findById(id).select('-password') || await Credential.findById(id).select('-password');

        if(!user){
            return res.status(404).json({error : 'User not found'})
        }

        if(user?._id.toString() !== req?.user?._id.toString()){
            return res.status(403).json({ error: 'Access denied' });
        }

        const orderProduct = await Order.find({customerId : {$in : id}}).sort({createdAt : -1})

        if (!orderProduct) {
            return res.status(404).json({ error: "Order not found" });
        }

        return res.status(200).send(orderProduct)
        
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "An error occurred during get order product", error: error.message });
    }
}

const userLoginGoogle = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).send('User not found');
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '15d' }
    );

    const getToken = 'Bearer ' + token;

    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/auth?token=${getToken}&_id=${user?._id}&name=${user?.name}&email=${user?.email}&role=${user.role}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


export { userRegistration,userLogin,userLogout,userProfile,getOrderProduct,userLoginGoogle }