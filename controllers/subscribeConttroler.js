import Subscribe from "../models/subscribeModel.js";
import User from "../models/userModel.js";
import transporter from '../config/middleware/nodemailer.js';
import dotenv from 'dotenv'
import Credential from "../models/credentialModel.js";
import dbConnected from "../config/db/dbConnecte.js";

dotenv.config()

const addSubsciberMail = async(req,res)=>{
    try {

        dbConnected()

        const {id} = req.params;

        const {email} = req.body

        const user = await User.findById(id) || await Credential.findById(id) ;
        if(!user){
            return res.status(404).json({error : "User not found"})
        }

        if (!user || !req.user || user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You are not authorized to perform this action.' });
        }

        const subsCriber = await Subscribe.find({})

        const isValidMail = email?.toLowerCase() === req?.user?.email?.toLowerCase();

        if (!isValidMail) {
            return res.status(403).json({ error: "Your email does not match your login email" });
        }


        const isSubscribe = subsCriber.some(sub => sub?.subscriberId?.toString() === user?._id?.toString());

        if(isSubscribe){
            await Subscribe.findOneAndDelete({ subscriberId: user?._id });
            return res.status(200).send({message :'Unsubscribe successful'})
        }else{
            const newSubscriber = new Subscribe({
                subscriberId :user?._id,
                subscriberEmail : email
            })

            await newSubscriber.save();
            return res.status(200).send({message : 'Subscribe successful'})

        }
    } catch (error) {
        console.error('Add subscriber mail error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const getAllMail = async(req,res)=>{
    try{
       
        dbConnected()
        
        const subsCriber = await Subscribe.find({})
        if(!subsCriber){
            return res.status(404).json({error : "User not found"})
        }

        return res.status(200).send(subsCriber)

    } catch (error) {
        console.error('Get all mail error:', error);
        return res.status(500).json({ error: 'Internal server error' });

    }
}

const sendMailAllSubscriber = async(req,res)=>{
    try {

        dbConnected()

        const {id} = req.params;

        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({error : 'User not found'})
        }

        if (!user || !req.user || user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You are not authorized to perform this action.' });
        }

        if(user?.role !== 'admin'){
            return res.status(403).json({error : 'Access denied'})
        }

        const subscirebers = await Subscribe.find({});

        const subMails = subscirebers.map(sub=>sub.subscriberEmail)

         // Send email
        const mailOptions = {
            from: process.env.admin_mail,
            to: subMails,
            subject: `New message from Zahidul`,
            // text: 
            html: `<h3 style="color: red;size : 30px;">New Product here</h3>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to send email' });
            } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ message: 'Email sent successfully' });
            }
        });

    } catch (error) {
        console.error('Send mail all subscriber error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


export { addSubsciberMail,getAllMail,sendMailAllSubscriber }