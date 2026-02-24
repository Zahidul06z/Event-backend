import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors'
// import dbConnected from './config/db/dbConnecte.js';
import userRoute from './routers/userRoute.js'
import productRoute from './routers/productRoute.js'
import blogRoute from './routers/blogRoute.js'
import storyRoute from './routers/storyRoute.js'
import orderRoute from './routers/orderRoute.js'
import subscribeRoute from './routers/subscribeRoute.js'
import couponRoute from './routers/couponRoute.js'
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import session from 'express-session';
import './config/auth/google.auth.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Correctly apply middleware
app.use(express.urlencoded({ extended: true, limit: '500mb' }));
app.use(express.json({ limit: '500mb' }));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));


app.use(session({
  secret: '12345678', // use a strong secret and store in env
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if using HTTPS
}));


app.use(passport.initialize());
app.use(passport.session());


// ✅ API routes

//Middleware
app.use('/api/users', userRoute);
app.use('/api/products',productRoute)
app.use('/api/blogs',blogRoute)
app.use('/api/stories',storyRoute)
app.use('/api/orders',orderRoute)
app.use('/api/subscribe',subscribeRoute)
app.use('/api/coupons',couponRoute)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Start server and connect DB
// app.listen(PORT, () => {
//     console.log(`Server Running at http://localhost:${PORT}`);
//     dbConnected();
// });

export default app;


 