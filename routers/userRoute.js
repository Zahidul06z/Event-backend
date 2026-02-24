import express from 'express';
import passport from 'passport';
import { getOrderProduct, userLogin,  userLoginGoogle,  userLogout, userProfile, userRegistration } from '../controllers/usercontroller.js';
import customJwtAuth from '../config/middleware/authentication.js';

const router = express.Router()

router.post('/registration',userRegistration)
router.post('/login',userLogin)
router.post('/logout',userLogout)
router.get('/getUser/:id',customJwtAuth,userProfile)
router.get('/getOrderProduct/:id',customJwtAuth,getOrderProduct)


// Step 1: Google login entry
router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get('/auth/google/callback',passport.authenticate('google', { session: false, failureRedirect: '/' }),userLoginGoogle);
export default router