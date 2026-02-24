import fs from 'fs';
import path from 'path';
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import { error } from 'console';
import Credential from '../models/credentialModel.js';

const createProduct = async(req,res)=>{
    try {

        const adminId = req.params.id;

        const {title,price,description,category,stock} = req.body;
        const videos = req.files?.video?.[0];
        const image = req.files?.image?.[0];
        
        const user = await User.findById(adminId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: "You are not authorized to create a product" });
        }

        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }

        if(image && videos){
            const newProduct = new Product({
                title,
                price,
                description,
                category,
                stock,
                image : image?.filename
            })

            await newProduct.save()
            return res.status(200).json({message : "Product Ctreate Successfully"})
        }
        else if(image){
            const newProduct = new Product({
                title,
                price,
                description,
                category,
                stock,
                image : image?.filename
            })

            await newProduct.save()
            return res.status(200).json({message : "Product Ctreate Successfully"})
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred in create product",
            error: error.message
        });
    }
}

const getProduct = async(req,res)=>{
    try {
        const {category} = req.params;
       
        const filter = category === 'all' ? {} : { category };
        const products = await Product.find(filter).sort({createdAt : -1});

        if(!products || products.length ===0){
            return res.status(404).json({error : 'No items were found for your query.'})
        }

        return res.status(200).send(products);

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred in create product",
            error: error.message
        });
    }
}

// const getSearchProduct = async(req,res)=>{
//     try {
//         const {search} = req.params;
       
//         const products = await Product.find({}).sort({createdAt : -1});

//         const filterProducts = products.filter(product => product.title.toLowerCase().includes(search.toLowerCase()));

//         return res.status(200).send(filterProducts);

//     } catch (error) {
//         console.error("Error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "An error occurred in create product",
//             error: error.message
//         });
//     }
// }

const getSingleProduct = async (req,res) =>{
    try {
        const {productID} = req.params;

        const product =  await Product.findById(productID)
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        const basedOnCategory = await Product.find({category : {$in : product?.category}}).sort({createdAt : -1});

        // console.log(basedOnCategory)

        return res.status(200).json({product : product,basedOnCategory : basedOnCategory})

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred in get single product",
            error: error.message
        });
    }
}


const deleteProduct = async(req,res)=>{
    try {
        const productId = req.params.id;
        const adminId = req.user._id;

        const user = await User.findById(adminId)
        if(!user){
            return res.status(404).json({error : 'User not found'})
        }

        const product = await Product.findById(productId)
        if(!product){
            return res.status(404).json({error : 'Product not found'})
        }

        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }

        if(user.role !== 'admin'){
            return res.status(403).json({error : 'You are not valide user to delete this blog'})
        }

        if (
            !product?.image || product?.image.includes('..') 
        ) {
            return res.status(400).json({ message: 'Invalid file names' });
        }

        const imagePath = path.join('uploads', 'product', 'images', product?.image);
        
        const deleteFile = (filePath) => {
            if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) console.error(`❌ Failed to delete: ${filePath}`, err);
                else console.log(`✅ Deleted: ${filePath}`);
            });
            } else {
            console.warn(`⚠️ File not found: ${filePath}`);
            }
        };

        deleteFile(imagePath);
       

        await Product.findByIdAndDelete(productId)
        return res.status(200).json({message : "successfull"})

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred in Delete Product",
            error: error.message
        });
    }
}

const ratingreviewsProduct = async(req,res)=>{
    try {
        const userId = req.user._id;
        const {productId} = req.params

        const {text,rating} = req.body

        const user = await User.findById(userId) || await Credential.findById(userId) ;
        if(!user){
            return res.status(404).json({error : "User not found"})
        }

        const product  = await Product.findById(productId);
        if(!product){
            return res.status(404).json({error : "Product not found"})
        }

        const isRating = product.ratings.some(rating => rating.userId.toString() === userId.toString());

        if(isRating){
            return res.status(409).json({error : "You already rating this course"})
        }
              
        // Add the new rating
        product.ratings.push({
            name: user.name,
            userId: userId,
            score: rating,
            reviwe: text
        });

        // Recalculate average rating (including the new one)
        const scores = product.ratings.map(r => r.score);
        const sum = scores.reduce((acc, val) => acc + val, 0);
        product.average = scores.length === 0 ? rating  : sum / scores.length;
        await product.save();

        return res.status(200).json({ message: "Rating submitted", ratings : product?.ratings, average : product?.average });
        
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred in product ratings and reviews",
            error: error.message
        });
    }
}

const basedOnRated = async(req,res)=>{
    try {
        const topRatedProduct = await Product.find({average : {$gte : 3}}).sort({average : -1});

        if(!topRatedProduct){
            return res.status(404).json({error : 'Products not found'})
        }

        return res.status(200).send(topRatedProduct)

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred in get single product",
            error: error.message
        });
    }
}

const  filterProduct = async(req,res) =>{
    try {
        const value1 = req.query.first;
        const value2 = req.query.second;

    //    const products =  await Product.find({$and : [{price : {$gte : value1}},{price : {$lte : value2}}]})

    const products = await Product.find({price: { $gte: value1, $lte: value2 }});

    if (!products || products.length === 0) {
        return res.status(404).json({ error: 'No related products found' });
    }

    return res.status(200).send(products)


    } catch (error) {
       console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred in get filter products",
            error: error.message
        }); 
    }
}

export {createProduct,getProduct,getSingleProduct,ratingreviewsProduct,deleteProduct,filterProduct,basedOnRated }