import express from 'express';
import { createProduct, deleteProduct, getProduct, getSingleProduct, filterProduct, ratingreviewsProduct, basedOnRated } from '../controllers/productConttroler.js';
import customJwtAuth from '../config/middleware/authentication.js';
import requireRoles from '../config/middleware/requireRole.js';
import upload from '../media/productUploads.js';
const router = express.Router()

router.post('/create/:id',upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]),customJwtAuth,requireRoles(['admin']),createProduct)
router.get('/getproduct/:category',getProduct)
router.get('/getSingleProduct/:productID',getSingleProduct)
router.delete('/delete/:id',customJwtAuth,requireRoles(['admin']),deleteProduct)
router.post('/ratingreviews/:productId',customJwtAuth,ratingreviewsProduct)
router.post('/filter/product',filterProduct)
router.get('/toprated/',basedOnRated)




export default router