import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/User';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      // Check if a user with the same email exists (account linking)
      const email = profile.emails?.[0].value;
      user = await User.findOne({ email });
      if (user) {
        user.googleId = profile.id;
        user.isEmailVerified = true;
        await user.save();
      } else {
        user = await User.create({
          googleId: profile.id,
          email,
          name: profile.displayName,
          isEmailVerified: true,
        });
      }
    }
    return done(null, user);
  } catch (err) {
    return done(err, undefined);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, undefined);
  }
});

export default passport; 