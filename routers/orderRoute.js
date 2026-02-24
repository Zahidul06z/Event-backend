import express from 'express'
import customJwtAuth from '../config/middleware/authentication.js'
import requireRoles from '../config/middleware/requireRole.js';
import { cashOnDelivary, getCodOrderProduct, ipnNotification, paymentCancle, paymentFail, paymentSslcommerz, paymentStatus, paymentSuccess, productTrack, setOrderStatus } from '../controllers/orderConttroler.js'

const router = express.Router()

// Cash On Delivery
router.post('/cod/:id',customJwtAuth,cashOnDelivary)
// get Cash On Deliver product
router.get('/successcod/:id',customJwtAuth,getCodOrderProduct)
// Payment with sslcommerz
router.post('/sslcommerz/:id',customJwtAuth,paymentSslcommerz)
// Payment Success
router.post('/success',paymentSuccess)
// Payment Fail
router.post('/fail',paymentFail);
// Payment Cancel
router.post('/cancel',paymentCancle);
// IPN (Instant Payment Notification)
router.post('/ipn',ipnNotification);
// Get Payment Status
router.get('/status/:transactionId',paymentStatus);
// Set Order Status
router.post('/track/status/:id',customJwtAuth,requireRoles(['admin']),setOrderStatus)
// Product Track Route
router.get('/track/:id',customJwtAuth,productTrack);


export default router