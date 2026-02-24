import Credential from "../../models/credentialModel.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import dotenv from 'dotenv'

dotenv.config()


// Apply google oauth 2.0
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `https://event-backend-dx9k.vercel.app/api/users/auth/google/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Example user shape
      const existingUser = await Credential.findOne({ email: profile.emails[0].value });

      if (existingUser) {
        return done(null, existingUser);
      } else {
        const newUser = await Credential.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
        });
        return done(null, newUser);
      }
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id); // Store user ID in session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Credential.findById(id); // Fetch user by ID
    done(null, user); // Attach user to req.user
  } catch (err) {
    done(err, null);
  }
});

