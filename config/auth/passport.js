import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../../models/userModel.js';
import dotenv from 'dotenv';
import Credential from '../../models/credentialModel.js';
dotenv.config();

// 🔸 Token blacklist (for logout)
const blacklistedTokens = new Set();

// 🔸 Configure strategy options
const opts = {
  jwtFromRequest: (req) => {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    req.token = token; // attach token to request
    return token;
  },
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true, // 👈 allows `req` to be passed into strategy
};

// 🔸 Setup strategy
passport.use(
  new JwtStrategy(opts, async (req, jwt_payload, done) => {
    try {
      const token = req.token; //access raw token from request

      if (blacklistedTokens.has(token)) {
        return done(null, false); // token is blacklisted
      }

      const user = await User.findById(jwt_payload.id).select('-password') || await Credential.findById(jwt_payload.id);
      if (!user) return done(null, false);

      return done(null, user);
    } catch (error) {
      console.error("JWT Strategy Error:", error);
      return done(error, false);
    }
  })
);

// 🔸 Export for usage
export { passport, blacklistedTokens };
