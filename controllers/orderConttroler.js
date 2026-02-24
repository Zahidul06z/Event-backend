import Order from '../models/orderModel.js';
import User from '../models/userModel.js'
import Product from '../models/productModel.js';
import sslcommerz from 'sslcommerz-lts';
import transporter from '../config/middleware/nodemailer.js';
import generateOrderEmailHTML from '../config/middleware/nodeMailerHTMLfile.js';
import Credential from '../models/credentialModel.js';
import dotenv from 'dotenv';
import dbConnected from '../config/db/dbConnecte.js';

dotenv.config()

const SSLCommerzPayment = sslcommerz;

const cashOnDelivary = async (req,res) =>{
    try {
      
      await dbConnected()

        const customerId = req.params.id;
        const {coustomerInfo,paymentMethod,delivaryCharge,productInfo} = req.body;

        
        const customer = await User.findById(customerId) || await Credential.findById(customerId) ;

        if (!customer) {
            return res.status(401).json({ error: "Invalid user. Please log in and try again." });
        }

        if (customer._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Access denied. You are not authorized." });
        }

       const productInfoList = Object.values(productInfo); 

        const productIds = productInfoList.map(p => p.id);
        console.log(productIds)
        const products = await Product.find({ _id: { $in: productIds } });

        if (!products || products.length === 0) {
            return res.status(404).json({ error: "Products not found or out of stock" });
        }

       for (const item of productInfoList) {
        const updated = await Product.findOneAndUpdate(
          { _id: item.id, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );

        if (!updated) {
          return res.status(400).json({
            error: `Product with ID ${item.id} does not have enough stock`
          });
        }}

        const items = products.map(product => {
            const matchingInfo = productInfoList.find(info => info.id === product._id.toString());
            const quantity = matchingInfo ? matchingInfo.quantity : 1;
            return {
                productId: product._id,
                title: product.title,
                price: product.price,
                quantity: quantity,
                image: product.image,
                category : product.category,
                total: product.price * quantity
            };
        });

        const shippingCost = delivaryCharge.place === 'barishal' ? 100 : 150;

        const totalAmount = items.reduce((sum, item) => sum + item.total, 0) + shippingCost;

        const newOrder = new Order({
            customerId: customer._id,
            customerName: coustomerInfo.name,
            customerEmail: coustomerInfo.email,
            phone: coustomerInfo.telephone,
            items: items,
            shippingAddress: {
                delivaryAddress: coustomerInfo.deliveryaddress,
                city: coustomerInfo.city,
                postCode: coustomerInfo.postcode,
                country: coustomerInfo.country
            },
            paymentMethod: paymentMethod,
            shippingCost,
            trackMessage : {
              title : 'pending',
              description : 'your order is now pending'
            },
            totalAmount
        });

        await newOrder.save();

        // const htmlContent = generateOrderEmailHTML(newOrder)

        // Send email
        // const mailOptions = {
        //   from: process.env.admin_mail,
        //   to: 'miamiami12345zz@gmail.com',
        //   subject: `New message from Tusher`,
        //   // text: 
        //   html: htmlContent,
        //   attachments: [
        //     ...Object.values(newOrder?.items).map((item, index) => ({
        //       filename: `product-${index + 1}.jpg`,
        //       path: `./uploads/product/images/${item.image}`,
        //       cid: `product-image-${index + 1}`,
        //     }))
        //   ],
        // };

      // transporter.sendMail(mailOptions, (error, info) => {
      //   if (error) {
      //     console.error(error);
      //     return res.status(500).json({ message: 'Failed to send email' });
      //   } else {
      //     console.log('Email sent: ' + info.response);
      //     return res.status(201).json({
      //         message: "Order created successfully",
      //         redirectUrl: `${process.env.FRONTEND_URL}/order-success/${newOrder._id}`,
      //     });
      //   }
      // }); 

      return res.status(201).json({
              message: "Order created successfully",
              redirectUrl: `https://event-frontend-weld.vercel.app/order-success/${newOrder._id}`,})

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred in Cash on delivary",
            error: error.message
        });
    }
}

const getCodOrderProduct = async(req,res) =>{
  try {
    
    await dbConnected()

    const orderId = req.params.id;
    const userId = req.user._id;

    const orderProduct = await Order.findById(orderId);
    if(!orderProduct){
      return res.status(404).json({error : 'Your order product not found'})
    }

    if (orderProduct.customerId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'You are not authorized to access this order.' });
    }

    return res.status(200).json({ message: 'Email sent successfully and saved to DB',
      orderProduct :orderProduct
    })

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred in Cash on delivary",
      error: error.message
    });
  }
}


// SSLCommerz Configuration
const store_id = 'zahid68668d5d23261';
const store_passwd = 'zahid68668d5d23261@ssl';
const is_live = false // true for live, false for sandbox

// Generate unique transaction ID
const generateTransactionId = () => {
  return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9);
};


const paymentSslcommerz = async (req,res) =>{
     try {

      await dbConnected()

        const customerId = req.params.id;
        const {coustomerInfo,paymentMethod,delivaryCharge,productInfo} = req.body;
        const customer = await User.findById(customerId) || await Credential.findById(customerId);

        if (!customer) {
            return res.status(401).json({ error: "Invalid user. Please log in and try again." });
        }

        if (customer._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Access denied. You are not authorized." });
        }

        const productInfoList = Object.values(productInfo); 
        const productIds = productInfoList.map(p => p.id);
        const products = await Product.find({ _id: { $in: productIds } });

        if (!products || products.length === 0) {
            return res.status(404).json({ error: "Products not found or out of stock" });
        }

        const items = products.map(product => {
          const matchingInfo = productInfoList.find(info => info.id === product._id.toString());
          const quantity = matchingInfo ? matchingInfo.quantity : 1;
          return {
            productId: product._id,
            title: product.title,
            price: product.price,
            quantity: quantity,
            image: product.image,
            category : product.category,
            total: product.price * quantity
          };
        });

        const shippingCost = delivaryCharge.place === 'barishal' ? 100 : 150;
        const totalAmount = items.reduce((sum, item) => sum + item.total, 0) + shippingCost;

        // Validate required fields
        if (!coustomerInfo || !paymentMethod || !delivaryCharge || !productInfo) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const transactionId = generateTransactionId();

        console.log("item",items.category)

      const data = {
      total_amount: totalAmount,
      currency: 'BDT',
      tran_id: transactionId,
      success_url: `${process.env.BACKEND_URL}/api/orders/success`,
      fail_url: `${process.env.BACKEND_URL}/api/orders/fail`,
      cancel_url: `${process.env.BACKEND_URL}/api/orders/cancel`,
      ipn_url: `${process.env.BACKEND_URL}/api/orders/ipn`,
      shipping_method: paymentMethod,
      product_name: items.map(i => i.title).join(', '),
      product_category: items.map(i => i.category).join(', '),
      product_profile: 'general',
      cus_name: coustomerInfo.name,
      cus_email: coustomerInfo.email,
      cus_add1: coustomerInfo.delivaryAddress,
      cus_city: coustomerInfo.city,
      cus_state: coustomerInfo.city,
      cus_postcode: coustomerInfo.city,
      cus_country: coustomerInfo.country,
      cus_phone: coustomerInfo.telephone,
      ship_add1: delivaryCharge.place,
      ship_city: coustomerInfo.city,
      ship_state:coustomerInfo.city,
      ship_postcode: coustomerInfo.city,
      ship_country: coustomerInfo.country,
      ship_name : 'Courier'
      };

      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      const apiResponse = await sslcz.init(data);
      // console.log('API Response:', JSON.stringify(apiResponse, null, 2));
      if (apiResponse?.GatewayPageURL) {

              const newOrder = new Order({
                  transactionId,
                  customerId: customer._id,
                  customerName: coustomerInfo.name,
                  customerEmail: coustomerInfo.email,
                  phone: coustomerInfo.telephone,
                  items: items,
                  shippingAddress: {
                      delivaryAddress: coustomerInfo.deliveryaddress,
                      city: coustomerInfo.city,
                      postCode: coustomerInfo.postcode,
                      country: coustomerInfo.country
                  },
                  paymentMethod: paymentMethod,
                  shippingCost,
                  trackMessage : {
                    title : 'pending',
                    description : 'your order is now pending'
                  },
                  totalAmount
              });

              await newOrder.save();
        
        res.json({
          success: true,
          paymentUrl: apiResponse?.GatewayPageURL,
          transactionId: transactionId
        });
      } else {
        res.status(400).json({ error: 'Payment initialization failed fgfdhfd' });
      }

    } catch (error) {
      console.error('Payment initialization error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
}


const paymentSuccess =  async (req, res) => {
  try {

    await dbConnected()

    const { tran_id, val_id } = req.body;
    
    // Validate payment with SSLCommerz
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const validation = await sslcz.validate({ val_id });
    
    if (validation.status === 'VALID') {
      // Update payment status in database
      const payment = await Order.findOneAndUpdate(
        { transactionId: tran_id },
        { 
          paymentStatus: 'paid',
          sslTransactionId: validation.tran_id,
          bankTransactionId: validation.bank_tran_id,
          cardType: validation.card_type,
          paymentType: validation.card_issuer,
          updatedAt: new Date()
        },
        { new: true }
      );
      
      if (payment) {

        const items = payment?.items

        for (const item of items) {
        const updated = await Product.findOneAndUpdate(
          { _id: item.productId, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );

        if (!updated) {
          return res.status(400).json({
            error: `Product with ID  does not have enough stock`
          });
        }}
        
        // const htmlContent = generateOrderEmailHTML(payment)

        // Send email
        // const mailOptions = {
        //   from: process.env.admin_mail,
        //   to: 'miamiami12345zz@gmail.com', 
        //   subject: `New message from Tusher`,
        //     // text: 
        //   html: htmlContent,
        //   attachments: [
        //     ...Object.values(payment?.items).map((item, index) => ({
        //       filename: `product-${index + 1}.jpg`,
        //       path: `./uploads/product/images/${item.image}`,
        //       cid: `product-image-${index + 1}`,
        //     }))
        //   ],
        // };

        // transporter.sendMail(mailOptions, (error, info) => {
        //   if (error) {
        //     console.error(error);
        //     return res.status(500).json({ message: 'Failed to send email' });
        //   } else {
        //     console.log('Email sent: ' + info.response);
        //   }
        // })

        // Redirect to frontend success page
        return res.redirect(`${process.env.FRONTEND_URL}/payment/success?transactionId=${tran_id}`);

      } else {
        res.redirect(`${process.env.FRONTEND_URL}/payment/error`);
      }
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/payment/error`);
    }
  } catch (error) {
    console.error('Payment success error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/payment/error`);
  }
};

const paymentFail = async (req, res) => {
  try {

    await dbConnected()

    const { tran_id } = req.body;
    
    await Order.findOneAndUpdate(
      { transactionId: tran_id },
      { paymentStatus: 'failed', updatedAt: new Date() }
    );
    
    res.redirect(`${process.env.FRONTEND_URL}/payment/failed?transactionId=${tran_id}`);
  } catch (error) {
    console.error('Payment fail error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/payment/error`);
  }
}

const paymentCancle =  async (req, res) => {
  try {

    await dbConnected()

    const { tran_id } = req.body;
    
    await Order.findOneAndUpdate(
      { transactionId: tran_id },
      { paymentStatus: 'cancelled', updatedAt: new Date() }
    );
    
    res.redirect(`${process.env.FRONTEND_URL}/payment/cancelled?transactionId=${tran_id}`);
  } catch (error) {
    console.error('Payment cancel error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/payment/error`);
  }
}

const ipnNotification =  async (req, res) => {
  try {

    await dbConnected()

    const { tran_id, status, val_id } = req.body;
    
    if (status === 'VALID') {
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      const validation = await sslcz.validate({ val_id });
      
      if (validation.status === 'VALID') {
        await Payment.findOneAndUpdate(
          { transactionId: tran_id },
          { 
            paymentStatus: 'paid',
            sslTransactionId: validation.tran_id,
            bankTransactionId: validation.bank_tran_id,
            updatedAt: new Date()
          }
        );
      }
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('IPN error:', error);
    res.status(500).send('Error');
  }
}

const paymentStatus =  async (req, res) => {
  try {

    await dbConnected()

    const { transactionId } = req.params;
    const payment = await Order.findOne({ transactionId });
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    return res.status(200).send({
        success: true,
        payment: {
          transactionId: payment.transactionId,
          totalAmount: payment.totalAmount,
          paymentStatus: payment.paymentStatus,
          items : payment.items, 
          customerName : payment.customerName,
          shippingCost : payment.shippingCost,
          shippingAddress : payment.shippingAddress,   
          phone : payment.phone,
          createdAt: payment.createdAt
        }
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const productTrack = async (req,res) =>{
  try {

    await dbConnected()

    const {id} = req.params;

    const trackProduct = await Order.findById(id);
    if (!trackProduct) {
      return res.status(404).json({error: 'You have not ordered this product Please order the product first and track it afterwards.'});
    }

    if (!req?.user?._id || trackProduct?.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const trackProductStatus = trackProduct?.trackMessage.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


    return res.status(200).json({
      trackProduct : trackProduct,
      trackProductStatus : trackProductStatus
    })



  } catch (error) {
    console.error('Get product tarck error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const setOrderStatus = async (req,res) =>{
  try {

    await dbConnected()

    const {id} = req.params;
    const userId = req.user._id;
    const {title,description} = req.body;

    const order = await Order.findById(id);
    if(!order){
      return res.status(404).json({error : 'Ordered item not found'})
    }

    const user = await User.findById(userId);
    if(!user || user.role !== 'admin'){
      return res.status(403).json({error : 'You are not a valid user to update orderStatus'})
    }

    const updateStatus = {
      title,
      description
    };

    order.trackMessage.push(updateStatus)

    await order.save()

    res.status(200).json({message : 'Status update successful'})

  } catch (error) {
    console.error('set product tarck status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export { cashOnDelivary,paymentSslcommerz,paymentSuccess,paymentFail,ipnNotification,paymentStatus,paymentCancle,getCodOrderProduct,productTrack,setOrderStatus }
