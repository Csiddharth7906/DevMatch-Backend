const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user');

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://devmatch-backend.onrender.com/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let existingUser = await User.findOne({ 
            $or: [
                { googleId: profile.id },
                { email: profile.emails[0].value }
            ]
        });

        if (existingUser) {
            // Update Google ID if user exists but doesn't have it
            if (!existingUser.googleId) {
                existingUser.googleId = profile.id;
                await existingUser.save();
            }
            return done(null, existingUser);
        }

        // Create new user
        const newUser = new User({
            googleId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            photoUrl: profile.photos[0].value,
            isEmailVerified: true
        });

        await newUser.save();
        done(null, newUser);
    } catch (error) {
        done(error, null);
    }
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://devmatch-backend.onrender.com/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let existingUser = await User.findOne({ 
            $or: [
                { githubId: profile.id },
                { email: profile.emails?.[0]?.value }
            ]
        });

        if (existingUser) {
            // Update GitHub ID if user exists but doesn't have it
            if (!existingUser.githubId) {
                existingUser.githubId = profile.id;
                await existingUser.save();
            }
            return done(null, existingUser);
        }

        // Create new user
        const newUser = new User({
            githubId: profile.id,
            firstName: profile.displayName?.split(' ')[0] || profile.username,
            lastName: profile.displayName?.split(' ')[1] || '',
            email: profile.emails?.[0]?.value || `${profile.username}@github.local`,
            photoUrl: profile.photos?.[0]?.value,
            github: profile.profileUrl,
            isEmailVerified: true
        });

        await newUser.save();
        done(null, newUser);
    } catch (error) {
        done(error, null);
    }
}));

module.exports = passport;
